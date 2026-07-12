import httpx
import asyncio
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from supabase import Client
from poll_manager import poll_manager


PW_BASE = "https://api.penpencil.co"


def create_poll_routes(app, supabase: Client):
    @app.post("/api/poll/connect")
    async def poll_connect(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        token = body.get("token")
        schedule_id = body.get("scheduleId")
        batch_id = body.get("batchId")

        if not all([user_id, token, schedule_id, batch_id]):
            return JSONResponse({"success": False, "message": "Missing required fields"}, status_code=400)

        try:
            poll_manager.connect(user_id, token, schedule_id, batch_id)
            return JSONResponse({"success": True, "message": "WebSocket connected"})
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)

    @app.post("/api/poll/disconnect")
    async def poll_disconnect(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        if not user_id:
            return JSONResponse({"success": False, "message": "userId required"}, status_code=400)

        poll_manager.disconnect(user_id)
        return JSONResponse({"success": True})

    @app.get("/api/poll")
    async def get_poll(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return {"poll": None}

        poll = poll_manager.get_active_poll(user_id)
        return {"poll": poll}

    @app.get("/api/poll/history")
    async def get_poll_history(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return {"history": []}

        history = poll_manager.get_poll_history(user_id)
        return {"history": history}

    @app.post("/api/poll/answer")
    async def submit_poll_answer(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        poll_id = body.get("pollId")
        option_id = body.get("optionId")

        if not all([user_id, poll_id, option_id]):
            return JSONResponse({"success": False, "message": "Missing required fields"}, status_code=400)

        # Get token from Supabase sync_data
        try:
            result = supabase.table("sync_data").select("data").eq("user_id", user_id).limit(1).execute()
            if not result.data:
                return JSONResponse({"success": False, "message": "User data not found"}, status_code=404)
            token = result.data[0]["data"].get("token")
            if not token:
                return JSONResponse({"success": False, "message": "No token found"}, status_code=404)
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)

        # Submit answer to PW API
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.put(
                    f"{PW_BASE}/v2/poll/upvote-poll",
                    json={"optionId": [option_id], "pollId": poll_id},
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                    },
                    timeout=10,
                )
                data = resp.json()
                return JSONResponse({"success": data.get("success", False), "message": data.get("message", "")})
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)

    @app.post("/api/poll/settings")
    async def save_poll_settings(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        auto_answer = body.get("autoAnswer", False)
        preferred_option = body.get("preferredOption", 1)

        if not user_id:
            return JSONResponse({"success": False, "message": "userId required"}, status_code=400)

        try:
            supabase.table("poll_settings").upsert({
                "user_id": user_id,
                "auto_answer": auto_answer,
                "preferred_option": preferred_option,
            }, on_conflict="user_id").execute()
            return JSONResponse({"success": True})
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)

    @app.get("/api/poll/settings")
    async def get_poll_settings(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return {"autoAnswer": False, "preferredOption": 1}

        try:
            result = supabase.table("poll_settings").select("*").eq("user_id", user_id).execute()
            if result.data:
                settings = result.data[0]
                return {
                    "autoAnswer": settings.get("auto_answer", False),
                    "preferredOption": settings.get("preferred_option", 1),
                }
        except Exception:
            pass

        return {"autoAnswer": False, "preferredOption": 1}
