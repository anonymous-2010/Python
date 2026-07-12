from datetime import datetime
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from supabase import Client


def create_message_routes(app, supabase: Client):
    @app.post("/api/messages")
    async def send_message(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        subject = body.get("subject", "").strip()
        message = body.get("message", "").strip()

        if not user_id or not message:
            return JSONResponse({"success": False, "message": "userId and message required"}, status_code=400)

        # Get username
        try:
            result = supabase.table("users").select("username").eq("id", user_id).execute()
            username = result.data[0]["username"] if result.data else "Unknown"
        except:
            username = "Unknown"

        try:
            supabase.table("messages").insert({
                "user_id": user_id,
                "username": username,
                "subject": subject,
                "message": message,
                "sender": "user",
                "read": False,
            }).execute()
            return JSONResponse({"success": True})
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)

    @app.get("/api/messages")
    async def get_user_messages(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return {"messages": []}

        try:
            result = supabase.table("messages").select("*").eq("user_id", user_id).order("created_at", desc=False).execute()
            return {"messages": result.data or []}
        except Exception as e:
            return {"messages": [], "error": str(e)}

    @app.get("/api/messages/unread")
    async def get_unread_count(request: Request):
        user_id = request.headers.get("X-User-Id") or request.query_params.get("userId")
        if not user_id:
            return {"count": 0}

        try:
            result = supabase.table("messages").select("id").eq("user_id", user_id).eq("sender", "admin").eq("read", False).execute()
            return {"count": len(result.data or [])}
        except:
            return {"count": 0}

    @app.post("/api/messages/read")
    async def mark_read(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        if not user_id:
            return JSONResponse({"success": False}, status_code=400)

        try:
            # Use raw query to ensure boolean is handled correctly
            supabase.table("messages").update({"read": True}).eq("user_id", user_id).eq("sender", "admin").execute()
            return JSONResponse({"success": True})
        except Exception as e:
            print(f"[Messages] Mark read failed: {e}")
            return JSONResponse({"success": False}, status_code=500)

    # Admin endpoints (header protected)
    @app.get("/api/admin/messages")
    async def admin_get_messages(request: Request):
        if request.headers.get("admin-portal") != "true":
            return JSONResponse({"error": "You bastard get lost"}, status_code=403)

        try:
            result = supabase.table("messages").select("*").order("created_at", desc=False).execute()
            return {"messages": result.data or []}
        except Exception as e:
            return {"messages": [], "error": str(e)}

    @app.get("/api/admin/messages/user/{user_id}")
    async def admin_get_user_messages(user_id: str, request: Request):
        if request.headers.get("admin-portal") != "true":
            return JSONResponse({"error": "You bastard get lost"}, status_code=403)

        try:
            result = supabase.table("messages").select("*").eq("user_id", user_id).order("created_at", desc=False).execute()
            return {"messages": result.data or []}
        except Exception as e:
            return {"messages": [], "error": str(e)}

    @app.post("/api/admin/messages/reply")
    async def admin_reply(request: Request):
        if request.headers.get("admin-portal") != "true":
            return JSONResponse({"error": "You bastard get lost"}, status_code=403)

        body = await request.json()
        user_id = body.get("userId")
        message = body.get("message", "").strip()

        if not user_id or not message:
            return JSONResponse({"success": False, "message": "userId and message required"}, status_code=400)

        try:
            supabase.table("messages").insert({
                "user_id": user_id,
                "username": "Support",
                "subject": "Reply",
                "message": message,
                "sender": "admin",
                "read": False,
            }).execute()
            return JSONResponse({"success": True})
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)
