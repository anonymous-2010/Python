import asyncio
import uvicorn
import os
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client

from routes.auth import create_auth_routes
from routes.schedule import create_schedule_routes
from routes.settings import create_settings_routes
from routes.poll import create_poll_routes
from routes.messages import create_message_routes

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

shutdown_event = asyncio.Event()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    shutdown_event.set()


app = FastAPI(title="PW Schedule Sync Server", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
create_auth_routes(app, supabase)
create_settings_routes(app, supabase)
create_schedule_routes(app, supabase, shutdown_event)
create_poll_routes(app, supabase)
create_message_routes(app, supabase)

# Serve frontend
STATIC_DIR = Path(__file__).parent / "frontend" / "dist"

if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(STATIC_DIR / "index.html"))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), timeout_graceful_shutdown=1.5)
