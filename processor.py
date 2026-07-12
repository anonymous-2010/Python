from utils import build_image, strip_html


def process_raw(raw: dict, prev: dict | None = None) -> dict:
    lecture_state = raw.get("_lectureState") or "open"

    if lecture_state == "closed":
        prev_batch = (prev or {}).get("batch")
        prev_teachers = (prev or {}).get("teachers") or []
        prev_user = (prev or {}).get("user")
        prev_token = (prev or {}).get("token") or raw.get("token")

        return {
            "_lectureState": "closed",
            "scheduleId": None,
            "batchId": prev_batch.get("batchId") if prev_batch else None,
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
            "batch": prev_batch,
            "teachers": prev_teachers,
            "user": prev_user,
            "token": prev_token,
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

    profile = u.get("profileId") or {}
    user_class = profile.get("class")
    user_board = profile.get("board")
    user_exams = profile.get("exams") or []
    user_wallet = profile.get("wallet")
    user_total_rewards = profile.get("totalRewards")
    user_coins = profile.get("coins") or {}
    user_is_profile_completed = profile.get("isProfileCompleted")
    user_created = u.get("created") or u.get("createdAt")
    user_username = u.get("username")
    user_unique_code = u.get("uniqueCode")
    user_is_verified_email = u.get("isVerifiedEmail")
    user_is_scholar = u.get("isScholar")
    user_roles = [r.get("name") for r in (u.get("roles") or []) if r.get("name")]
    org = u.get("organization") or {}
    user_org_name = org.get("name")

    profile_address = profile.get("address") or {}
    user_state = profile_address.get("state") or address.get("state")
    user_pincode = profile_address.get("pincode") or address.get("pincode")

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
            "state": user_state,
            "pincode": user_pincode,
            "email": user_email,
            "image": user_image,
            "username": user_username,
            "uniqueCode": user_unique_code,
            "class": user_class,
            "board": user_board,
            "exams": user_exams,
            "wallet": user_wallet,
            "totalRewards": user_total_rewards,
            "coins": user_coins,
            "isProfileCompleted": user_is_profile_completed,
            "createdAt": user_created,
            "isVerifiedEmail": user_is_verified_email,
            "isScholar": user_is_scholar,
            "roles": user_roles,
            "orgName": user_org_name,
        },
        "token": raw.get("token"),
    }
