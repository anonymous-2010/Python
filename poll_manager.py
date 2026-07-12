import json
import asyncio
import threading
import websocket
from datetime import datetime


class PollManager:
    def __init__(self):
        self.active_polls: dict[str, dict] = {}  # user_id -> poll data
        self.poll_history: dict[str, list[dict]] = {}  # user_id -> list of polls
        self.ws_connections: dict[str, websocket.WebSocketApp] = {}
        self.subscribers: dict[str, list[asyncio.Queue]] = {}
        self._loop = None
        self._supabase = None

    def set_loop(self, loop):
        self._loop = loop

    def set_supabase(self, sb):
        self._supabase = sb

    async def notify_poll(self, user_id: str, data):
        if user_id not in self.subscribers:
            return
        dead = []
        for q in self.subscribers[user_id]:
            try:
                q.put_nowait(data)
            except Exception:
                dead.append(q)
        for q in dead:
            self.subscribers[user_id].remove(q)

    def _on_ws_message(self, user_id, ws, message):
        try:
            data = json.loads(message)
            operation = data.get("operation")

            if operation == "start":
                poll_data = {
                    "pollId": data.get("pollId"),
                    "question": data.get("data", {}).get("poll_question"),
                    "options": data.get("data", {}).get("pollOptions", []),
                    "expiryDuration": data.get("data", {}).get("expiryDuration", 60),
                    "type": data.get("data", {}).get("type", "single"),
                    "seqNumber": data.get("data", {}).get("pollSeqNumber"),
                    "receivedAt": datetime.now().isoformat(),
                    "status": "active",
                }
                self.active_polls[user_id] = poll_data

                if user_id not in self.poll_history:
                    self.poll_history[user_id] = []
                self.poll_history[user_id].append(poll_data)

                if self._loop:
                    asyncio.run_coroutine_threadsafe(
                        self.notify_poll(user_id, {"_type": "poll_start", "poll": poll_data}),
                        self._loop
                    )
                print(f"[Poll] New poll for {user_id}: {poll_data['question']}")

            elif operation == "stop_expiry":
                poll_id = data.get("pollId")
                if user_id in self.active_polls and self.active_polls[user_id].get("pollId") == poll_id:
                    self.active_polls[user_id]["status"] = "expired"
                    if self._loop:
                        asyncio.run_coroutine_threadsafe(
                            self.notify_poll(user_id, {"_type": "poll_expired", "pollId": poll_id}),
                            self._loop
                        )
                print(f"[Poll] Poll expired for {user_id}: {poll_id}")

            elif operation == "result":
                poll_id = data.get("pollId")
                result_data = data.get("data", {})
                if user_id in self.active_polls and self.active_polls[user_id].get("pollId") == poll_id:
                    self.active_polls[user_id]["status"] = "completed"
                    self.active_polls[user_id]["result"] = result_data.get("result", {})
                    self.active_polls[user_id]["leaderboard"] = result_data.get("leaderboard", [])

                if self._loop:
                    asyncio.run_coroutine_threadsafe(
                        self.notify_poll(user_id, {
                            "_type": "poll_result",
                            "pollId": poll_id,
                            "result": result_data.get("result", {}),
                            "leaderboard": result_data.get("leaderboard", []),
                        }),
                        self._loop
                    )

                # History stored in memory, frontend saves to localStorage
                print(f"[Poll] Result for {user_id}: {poll_id}")

        except Exception as e:
            print(f"[Poll] Error processing message for {user_id}: {e}")

    def _on_ws_error(self, user_id, ws, error):
        print(f"[Poll] WebSocket error for {user_id}: {error}")

    def _on_ws_close(self, user_id, ws, close_status_code, close_msg):
        print(f"[Poll] WebSocket closed for {user_id}")

    def _on_ws_open(self, user_id, ws):
        print(f"[Poll] WebSocket connected for {user_id}")

    def connect(self, user_id: str, token: str, schedule_id: str, batch_id: str):
        if user_id in self.ws_connections:
            try:
                self.ws_connections[user_id].close()
            except:
                pass

        url = (
            f"wss://central-socket.penpencil.co/central-socket/ws"
            f"?userId={user_id}"
            f"&scheduleId={schedule_id}"
            f"&batchId={batch_id}"
            f"&roomContext=poll"
            f"&token={token}"
        )

        ws = websocket.WebSocketApp(
            url,
            on_message=lambda ws, msg: self._on_ws_message(user_id, ws, msg),
            on_error=lambda ws, err: self._on_ws_error(user_id, ws, err),
            on_close=lambda ws, code, msg: self._on_ws_close(user_id, ws, code, msg),
            on_open=lambda ws: self._on_ws_open(user_id, ws),
        )

        self.ws_connections[user_id] = ws

        thread = threading.Thread(target=ws.run_forever, daemon=True)
        thread.start()
        print(f"[Poll] Connecting WebSocket for user {user_id}")

    def disconnect(self, user_id: str):
        if user_id in self.ws_connections:
            try:
                self.ws_connections[user_id].close()
            except:
                pass
            del self.ws_connections[user_id]
            print(f"[Poll] Disconnected WebSocket for user {user_id}")

    def get_active_poll(self, user_id: str):
        poll = self.active_polls.get(user_id)
        if poll and poll.get("status") == "active":
            return poll
        return None

    def get_poll_history(self, user_id: str):
        return self.poll_history.get(user_id, [])[-20:]


poll_manager = PollManager()
