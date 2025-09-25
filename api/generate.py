import jwt
import json
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler

secret_key = "ProtectYourSite"

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")  # CORS
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self._set_headers(405)
        self.wfile.write(json.dumps({
            "status": "error",
            "message": "Method not allowed"
        }).encode())

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            data = json.loads(raw or b"{}")

            if not data:
                self._set_headers(400)
                self.wfile.write(json.dumps({
                    "error": "No data provided"
                }).encode())
                return

            payload = data.copy()
            payload["exp"] = datetime.utcnow() + timedelta(hours=1)
            token = jwt.encode(payload, secret_key, algorithm="HS256")

            self._set_headers(200)
            self.wfile.write(json.dumps({"token": token}).encode())

        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({
                "status": "error",
                "message": str(e)
            }).encode())
