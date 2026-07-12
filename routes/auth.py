import uuid
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from supabase import Client

router = APIRouter()


def create_auth_routes(app, supabase: Client):
    @app.post("/api/auth/signup")
    async def signup(request: Request):
        body = await request.json()
        username = body.get("username", "").strip()
        password = body.get("password", "").strip()
        if not username or not password:
            return JSONResponse({"success": False, "message": "Username and password required"}, status_code=400)

        existing = supabase.table("users").select("*").eq("username", username).execute()
        if existing.data:
            return JSONResponse({"success": False, "message": "Username already taken"}, status_code=409)

        user_id = str(uuid.uuid4())
        result = supabase.table("users").insert({
            "id": user_id,
            "username": username,
            "password": password,
        }).execute()

        if result.data:
            return JSONResponse({"success": True, "userId": user_id, "username": username})
        return JSONResponse({"success": False, "message": "Failed to create user"}, status_code=500)

    @app.post("/api/auth/login")
    async def login(request: Request):
        body = await request.json()
        username = body.get("username", "").strip()
        password = body.get("password", "").strip()
        if not username or not password:
            return JSONResponse({"success": False, "message": "Username and password required"}, status_code=400)

        result = supabase.table("users").select("*").eq("username", username).eq("password", password).execute()
        if result.data:
            user = result.data[0]
            return JSONResponse({"success": True, "userId": user["id"], "username": user["username"]})
        return JSONResponse({"success": False, "message": "Invalid credentials"}, status_code=401)

    @app.post("/api/extension/status")
    async def extension_status(request: Request):
        body = await request.json()
        user_id = body.get("userId")
        installed = body.get("installed", True)

        if not user_id:
            return JSONResponse({"success": False, "message": "userId required"}, status_code=400)

        try:
            supabase.table("users").update({"extension_installed": installed}).eq("id", user_id).execute()
            return JSONResponse({"success": True})
        except Exception as e:
            return JSONResponse({"success": False, "message": str(e)}, status_code=500)

    @app.get("/api/extension/status/{user_id}")
    async def get_extension_status(user_id: str):
        try:
            result = supabase.table("users").select("extension_installed").eq("id", user_id).execute()
            if result.data:
                return {"installed": result.data[0].get("extension_installed", False)}
            return {"installed": False}
        except Exception:
            return {"installed": False}
