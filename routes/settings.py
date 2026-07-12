import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, Response, PlainTextResponse
from supabase import Client


def create_settings_routes(app, supabase: Client):
    @app.get("/status")
    async def status():
        return PlainTextResponse("Backend Server Running")

    @app.get("/api/server-status")
    async def server_status():
        try:
            result = supabase.table("serverstatus").select("is_active").limit(1).execute()
            if result.data:
                return {"active": result.data[0].get("is_active", True)}
            return {"active": True}
        except Exception:
            return {"active": True}

    @app.get("/api/download-link")
    async def get_download_link():
        try:
            result = supabase.table("settings").select("value").eq("key", "extension_download_url").execute()
            if result.data:
                return {"url": result.data[0].get("value", "")}
            return {"url": ""}
        except Exception:
            return {"url": ""}

    @app.get("/api/download-extension")
    async def download_extension():
        try:
            result = supabase.table("settings").select("value").eq("key", "extension_download_url").execute()
            if not result.data or not result.data[0].get("value"):
                return JSONResponse({"error": "No download link configured"}, status_code=404)

            url = result.data[0]["value"]
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, timeout=60)
                if resp.status_code == 200:
                    content = resp.content
                    return Response(
                        content=content,
                        media_type="application/zip",
                        headers={
                            "Content-Disposition": 'attachment; filename="Physics-Wallah-Extension.zip"',
                            "Content-Length": str(len(content)),
                        },
                    )
            return JSONResponse({"error": "Failed to download"}, status_code=500)
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)

    @app.get("/api/audio-guide")
    async def audio_guide():
        try:
            result = supabase.table("settings").select("value").eq("key", "audio_guide_url").execute()
            if not result.data or not result.data[0].get("value"):
                return JSONResponse({"error": "No audio guide configured"}, status_code=404)

            url = result.data[0]["value"]
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, timeout=60)
                if resp.status_code == 200:
                    content = resp.content
                    return Response(
                        content=content,
                        media_type="audio/wav",
                        headers={
                            "Content-Length": str(len(content)),
                            "Accept-Ranges": "bytes",
                            "Cache-Control": "public, max-age=3600",
                        },
                    )
            return JSONResponse({"error": "Failed to fetch audio"}, status_code=500)
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)

    @app.get("/api/audio-guide-url")
    async def audio_guide_url():
        try:
            result = supabase.table("settings").select("value").eq("key", "audio_guide_url").execute()
            if result.data:
                return {"url": result.data[0].get("value", "")}
            return {"url": ""}
        except Exception:
            return {"url": ""}

    @app.get("/api/intro-audio")
    async def intro_audio():
        try:
            result = supabase.table("settings").select("value").eq("key", "introduction_audio_url").execute()
            if not result.data or not result.data[0].get("value"):
                return JSONResponse({"error": "No intro audio configured"}, status_code=404)

            url = result.data[0]["value"]
            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(url, timeout=60)
                if resp.status_code == 200:
                    content = resp.content
                    return Response(
                        content=content,
                        media_type="audio/wav",
                        headers={
                            "Content-Length": str(len(content)),
                            "Accept-Ranges": "bytes",
                            "Cache-Control": "public, max-age=3600",
                        },
                    )
            return JSONResponse({"error": "Failed to fetch audio"}, status_code=500)
        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)

    @app.get("/api/intro-audio-url")
    async def intro_audio_url():
        try:
            result = supabase.table("settings").select("value").eq("key", "introduction_audio_url").execute()
            if result.data:
                return {"url": result.data[0].get("value", "")}
            return {"url": ""}
        except Exception:
            return {"url": ""}
