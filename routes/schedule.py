import json
import asyncio
from datetime import datetime
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, PlainTextResponse, StreamingResponse
from supabase import Client
from processor import process_raw
from poll_manager import poll_manager


def create_schedule_routes(app, supabase: Client, shutdown_event: asyncio.Event):
    user_history: dict[str, list[dict]] = {}
    user_latest: dict[str, dict] = {}
    user_counter: dict[str, int] = {}
    subscribers: dict[str, list[asyncio.Queue]] = {}
    online_users: dict[str, dict] = {}  # user_id -> { last_seen, username, token, password }

    async def notify(user_id: str, data):
        if user_id not in subscribers:
            return
        dead = []
        for q in subscribers[user_id]:
            try:
                q.put_nowait(data)
            except Exception:
                dead.append(q)
        for q in dead:
            subscribers[user_id].remove(q)

    # Forward poll events to SSE subscribers
    async def poll_event_forwarder():
        while not shutdown_event.is_set():
            for uid in list(poll_manager.subscribers.keys()):
                for q in list(poll_manager.subscribers.get(uid, [])):
                    try:
                        data = q.get_nowait()
                        await notify(uid, data)
                    except:
                        pass
            await asyncio.sleep(0.1)

    # Start poll event forwarder
    @app.on_event("startup")
    async def start_poll_forwarder():
        poll_manager.set_loop(asyncio.get_event_loop())
        poll_manager.set_supabase(supabase)
        asyncio.create_task(poll_event_forwarder())

    @app.post("/api/schedule")
    async def receive_schedule(request: Request):
        raw = await request.json()
        user_id = request.headers.get("X-User-Id")

        if user_id:
            user_check = supabase.table("users").select("id").eq("id", user_id).execute()
            if not user_check.data:
                return JSONResponse({"success": False, "message": "Invalid user ID"}, status_code=401)
        else:
            return JSONResponse({"success": False, "message": "User ID required"}, status_code=401)

        prev = user_latest.get(user_id)
        data = process_raw(raw, prev=prev)
        data["_receivedAt"] = datetime.now().isoformat()
        data["_userId"] = user_id
        user_counter[user_id] = user_counter.get(user_id, 0) + 1
        data["_dataNumber"] = user_counter[user_id]
        user_latest[user_id] = data
        if user_id not in user_history:
            user_history[user_id] = []
        user_history[user_id].append(data)

        try:
            supabase.table("sync_data").upsert({
                "user_id": user_id,
                "data": data,
            }, on_conflict="user_id").execute()
        except Exception as e:
            print(f"[Sync] Supabase upsert failed: {e}")

        # Auto-connect to poll WebSocket if we have the required data
        token = data.get("token")
        schedule_id = data.get("scheduleId")
        batch_id = data.get("batchId")
        if token and schedule_id and batch_id and data.get("_lectureState") == "open":
            if user_id not in poll_manager.ws_connections:
                try:
                    poll_manager.connect(user_id, token, schedule_id, batch_id)
                except Exception as e:
                    print(f"[Poll] Auto-connect failed for {user_id}: {e}")

        # Track online user
        user_info = data.get("user") or {}
        online_users[user_id] = {
            "last_seen": datetime.now().isoformat(),
            "username": user_info.get("name") or "Unknown",
            "token": token,
            "userId": user_id,
            "scheduleId": schedule_id,
            "batchId": batch_id,
            "isOnline": True,
        }

        await notify(user_id, data)
        return {"status": "ok", "dataNumber": user_counter[user_id]}


    @app.get("/api/admin/users")
    async def get_all_users(request: Request):
        """Get all users with online/offline status for admin portal"""
        if request.headers.get("admin-portal") != "true":
            return JSONResponse({"error": "You bastard get lost"}, status_code=403)

        try:
            result = supabase.table("users").select("id, username, password, extension_installed").execute()
            users = result.data or []
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)

        # Mark online/offline based on last_seen (within 15 seconds)
        now = datetime.now()
        for user in users:
            uid = user["id"]
            if uid in online_users:
                last_seen = datetime.fromisoformat(online_users[uid]["last_seen"])
                diff = (now - last_seen).total_seconds()
                user["isOnline"] = diff < 15
                user["lastSeen"] = online_users[uid]["last_seen"]
                user["token"] = online_users[uid].get("token")
                user["scheduleId"] = online_users[uid].get("scheduleId")
                user["batchId"] = online_users[uid].get("batchId")
            else:
                user["isOnline"] = False
                user["lastSeen"] = None
                user["token"] = None
                user["scheduleId"] = None
                user["batchId"] = None

        return {"users": users}


    @app.get("/api/admin/user-count")
    async def get_user_count(request: Request):
        """Get online/offline counts for admin"""
        if request.headers.get("admin-portal") != "true":
            return JSONResponse({"error": "You bastard get lost"}, status_code=403)

        try:
            result = supabase.table("users").select("id").execute()
            total = len(result.data or [])
        except:
            total = 0

        now = datetime.now()
        online = 0
        for uid, info in online_users.items():
            last_seen = datetime.fromisoformat(info["last_seen"])
            if (now - last_seen).total_seconds() < 15:
                online += 1

        return {"total": total, "online": online, "offline": total - online}

    @app.post("/api/heartbeat")
    async def heartbeat(request: Request):
        user_id = request.headers.get("X-User-Id")
        token = request.headers.get("X-Token")
        if not user_id:
            return {"status": "ignored"}

        # Update last seen
        if user_id in online_users:
            online_users[user_id]["last_seen"] = datetime.now().isoformat()
            if token:
                online_users[user_id]["token"] = token
        else:
            try:
                result = supabase.table("users").select("username").eq("id", user_id).execute()
                username = result.data[0]["username"] if result.data else "Unknown"
            except:
                username = "Unknown"

            online_users[user_id] = {
                "last_seen": datetime.now().isoformat(),
                "username": username,
                "token": token,
                "userId": user_id,
                "scheduleId": None,
                "batchId": None,
                "isOnline": True,
            }

        return {"status": "ok"}

    @app.get("/api/latest")
    async def get_latest(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return {}

        if user_id in user_latest:
            return user_latest[user_id]

        try:
            result = supabase.table("sync_data").select("data").eq("user_id", user_id).limit(1).execute()
            if result.data:
                data = result.data[0]["data"]
                user_latest[user_id] = data
                return data
        except Exception as e:
            print(f"[Sync] Supabase fetch failed: {e}")

        return {}

    @app.get("/api/counter")
    async def get_counter(request: Request):
        user_id = request.headers.get("X-User-Id")
        return {"counter": user_counter.get(user_id, 0) if user_id else 0}

    @app.get("/api/events")
    async def sse_events(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return PlainTextResponse("User ID required", status_code=401)

        queue: asyncio.Queue = asyncio.Queue()
        if user_id not in subscribers:
            subscribers[user_id] = []
        subscribers[user_id].append(queue)

        async def stream():
            try:
                while not shutdown_event.is_set():
                    if await request.is_disconnected():
                        break
                    try:
                        data = await asyncio.wait_for(queue.get(), timeout=5)
                        if data is None:
                            break
                        yield f"data: {json.dumps(data)}\n\n"
                    except asyncio.TimeoutError:
                        yield ": keepalive\n\n"
            finally:
                if user_id in subscribers and queue in subscribers[user_id]:
                    subscribers[user_id].remove(queue)

        return StreamingResponse(stream(), media_type="text/event-stream")

    @app.post("/api/counter/reset")
    async def reset_counter(request: Request):
        user_id = request.headers.get("X-User-Id")
        if user_id:
            user_counter[user_id] = 0
            await notify(user_id, {"_type": "counter_reset", "_dataNumber": 0})
        return {"status": "ok", "counter": 0}

    @app.get("/api/history")
    async def get_history(request: Request):
        user_id = request.headers.get("X-User-Id")
        if not user_id:
            return []

        if user_id in user_history and user_history[user_id]:
            return user_history[user_id][-50:]

        try:
            result = supabase.table("sync_data").select("data").eq("user_id", user_id).limit(1).execute()
            if result.data:
                data = result.data[0]["data"]
                user_history[user_id] = [data]
                return [data]
        except Exception as e:
            print(f"[Sync] Supabase history fetch failed: {e}")

        return []
