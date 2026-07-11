from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse, StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import json, asyncio, uvicorn, os, re
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PW Schedule Sync Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

history: list[dict] = []
latest: dict = {}
counter = 0
subscribers: list[asyncio.Queue] = []


async def notify(data):
    dead = []
    for q in subscribers:
        try:
            q.put_nowait(data)
        except Exception:
            dead.append(q)
    for q in dead:
        subscribers.remove(q)


def deep_get(obj, *keys, default=None):
    if not obj or not isinstance(obj, dict):
        return default
    for k in keys:
        if k in obj and obj[k] is not None and obj[k] != "":
            return obj[k]
    for v in obj.values():
        if isinstance(v, dict) and v:
            for k in keys:
                if k in v and v[k] is not None and v[k] != "":
                    return v[k]
    return default


def build_image(img):
    if not isinstance(img, dict):
        return None
    if img.get("url"):
        return img["url"]
    if img.get("key"):
        return (img.get("baseUrl") or "https://static.pw.live/") + img["key"]
    return None


def strip_html(html):
    if not html:
        return None
    text = re.sub(r"<[^>]+>", " ", str(html))
    text = re.sub(r"&[a-zA-Z#0-9]+;", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text or None


def process_raw(raw: dict) -> dict:
    lecture_state = raw.get("_lectureState") or "open"

    if lecture_state == "closed":
        return {
            "_lectureState": "closed",
            "scheduleId": None,
            "batchId": None,
            "topic": None,
            "teacherName": None,
            "teacherImage": None,
            "subject": None,
            "url": None,
            "date": None,
            "startTime": None,
            "endTime": None,
            "lectureStatus": None,
            "lectureTeacher": None,
            "batch": None,
            "teachers": [],
            "user": None,
        }

    s = raw.get("scheduleDetails") or {}
    b = raw.get("batchData") or {}
    u = (raw.get("user") or {}).get("data") or {}

    schedule_id = s.get("_id")
    batch_id = s.get("batchId")
    topic = s.get("topic")
    teacher_name = s.get("teacherName")
    subject = s.get("subject") or {}
    url = s.get("url")
    date = s.get("date")
    start_time = s.get("startTime")
    end_time = s.get("endTime")
    is_active = s.get("isActive")
    is_live = s.get("isLive")
    status = s.get("status")

    lecture_teacher = None
    if b and s:
        subjects = b.get("subjects") or []
        match_subj_id = s.get("batchSubjectId") or s.get("subjectId")
        match_teacher_ids = s.get("teachers") or []
        matched_subject = None
        if match_subj_id:
            matched_subject = next((x for x in subjects if x.get("_id") == match_subj_id or x.get("subjectId") == match_subj_id), None)
        if matched_subject:
            tids = matched_subject.get("teacherIds") or []
            if match_teacher_ids:
                lecture_teacher = next((t for t in tids if t.get("_id") in match_teacher_ids), None)
            if not lecture_teacher and tids:
                lecture_teacher = tids[0]
        if not lecture_teacher and match_teacher_ids:
            for subj in subjects:
                for t in (subj.get("teacherIds") or []):
                    if t.get("_id") in match_teacher_ids:
                        lecture_teacher = t
                        break
                if lecture_teacher:
                    break

    lt_name = None
    lt_image = None
    if lecture_teacher:
        lt_name = ((lecture_teacher.get("firstName") or "") + " " + (lecture_teacher.get("lastName") or "")).strip()
        img = lecture_teacher.get("imageId") or {}
        if img.get("key"):
            lt_image = (img.get("baseUrl") or "https://static.pw.live/") + img["key"]

    batch_name = b.get("name") or b.get("batchName")
    class_name = b.get("class")
    exam = b.get("exam")
    language = b.get("language")
    mode = b.get("mode")
    batch_status = b.get("status")
    start_date = b.get("startDate")
    end_date = b.get("endDate")

    all_teachers = []
    for subj in (b.get("subjects") or []):
        simg = subj.get("imageId") or {}
        subject_image = build_image(simg)
        for t in (subj.get("teacherIds") or []):
            name = ((t.get("firstName") or "") + " " + (t.get("lastName") or "")).strip()
            img = t.get("imageId") or {}
            image = build_image(img)
            all_teachers.append({
                "id": t.get("_id"),
                "name": name,
                "subject": subj.get("subject") or "",
                "image": image,
                "subjectImage": subject_image,
                "experience": t.get("experience"),
                "qualification": t.get("qualification"),
            })

    user_name = ((u.get("firstName") or "") + " " + (u.get("lastName") or "")).strip() or None
    user_id = u.get("_id") or u.get("userId") or u.get("id")
    user_phone = u.get("primaryNumber") or u.get("phone") or u.get("mobile") or u.get("phoneNumber")
    if isinstance(user_phone, dict):
        user_phone = user_phone.get("number") or user_phone.get("mobile") or ""
    if user_phone and isinstance(user_phone, str):
        user_phone = user_phone.strip()
        if not user_phone.startswith("+") and u.get("countryCode"):
            user_phone = f"{u['countryCode']} {user_phone}"
    elif user_phone is not None:
        user_phone = str(user_phone)
    else:
        user_phone = None
    address = u.get("address") or {}
    user_city = address.get("city") or u.get("city")
    if isinstance(user_city, dict):
        parts = [user_city.get("city"), user_city.get("state"), user_city.get("pincode")]
        user_city = ", ".join(p for p in parts if p) or None
    elif user_city:
        state = address.get("state") or ""
        pincode = address.get("pincode") or ""
        parts = [user_city, state, pincode]
        user_city = ", ".join(p for p in parts if p)
    user_email = u.get("email") or u.get("emailId")
    user_image = None
    img = u.get("imageId") or {}
    if img.get("key"):
        user_image = (img.get("baseUrl") or "https://static.pw.live/") + img["key"]

    return {
        "_lectureState": "open",
        "scheduleId": schedule_id,
        "batchId": batch_id,
        "topic": topic,
        "teacherName": lt_name or teacher_name,
        "teacherImage": lt_image,
        "subject": subject,
        "url": url,
        "date": date,
        "startTime": start_time,
        "endTime": end_time,
        "lectureStatus": status,
        "isActive": is_active,
        "isLive": is_live,
        "lectureTeacher": {"name": lt_name, "image": lt_image} if lt_name else None,
        "batch": {
            "batchId": b.get("_id"),
            "name": batch_name,
            "class": class_name,
            "exam": exam,
            "language": language,
            "mode": mode,
            "status": batch_status,
            "startDate": start_date,
            "endDate": end_date,
            "batchCode": b.get("batchCode"),
            "byName": b.get("byName"),
            "isPurchased": b.get("isPurchased"),
            "subjectCount": len(b.get("subjects") or []),
            "program": (b.get("program") or {}).get("name"),
            "previewImage": build_image(b.get("previewImage")),
            "fee": b.get("fee"),
            "description": strip_html(b.get("description")),
        },
        "teachers": all_teachers,
        "user": {
            "userId": user_id,
            "name": user_name,
            "phone": user_phone,
            "city": user_city,
            "email": user_email,
            "image": user_image,
        },
    }


@app.get("/status")
async def status():
    return PlainTextResponse("Backend Server Running")


@app.post("/api/schedule")
async def receive_schedule(request: Request):
    global latest, counter
    raw = await request.json()
    data = process_raw(raw)
    data["_receivedAt"] = datetime.now().isoformat()
    counter += 1
    data["_dataNumber"] = counter
    latest = data
    history.append(data)
    await notify(data)
    return {"status": "ok", "dataNumber": counter}


@app.get("/api/latest")
async def get_latest():
    return latest


@app.get("/api/counter")
async def get_counter():
    return {"counter": counter}


@app.get("/api/events")
async def sse_events(request: Request):
    queue: asyncio.Queue = asyncio.Queue()
    subscribers.append(queue)

    async def stream():
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    data = await asyncio.wait_for(queue.get(), timeout=30)
                    yield f"data: {json.dumps(data)}\n\n"
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        finally:
            if queue in subscribers:
                subscribers.remove(queue)

    return StreamingResponse(stream(), media_type="text/event-stream")


@app.post("/api/counter/reset")
async def reset_counter():
    global counter
    counter = 0
    await notify({"_type": "counter_reset", "_dataNumber": 0})
    return {"status": "ok", "counter": 0}


@app.get("/api/history")
async def get_history():
    return history[-50:]


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
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
