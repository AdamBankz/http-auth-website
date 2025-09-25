import jwt
from datetime import datetime, timedelta
import json

secret_key = "ProtectYourSite"

def handler(request):
    try:
        if request.method == "POST":
            path = request.path

            # Read body safely
            try:
                data = request.json()
            except:
                data = None

            if not data:
                return {
                    "statusCode": 400,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": "No data provided"})
                }

            # Generate token
            if path.endswith("/generate"):
                payload = data.copy()
                payload["exp"] = datetime.utcnow() + timedelta(hours=1)
                token = jwt.encode(payload, secret_key, algorithm="HS256")
                return {
                    "statusCode": 200,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"token": token})
                }

            # Validate token
            elif path.endswith("/validate"):
                try:
                    jwt.decode(data["token"], secret_key, algorithms=["HS256"])
                    return {
                        "statusCode": 200,
                        "headers": {"Content-Type": "application/json"},
                        "body": json.dumps({"success": "valid"})
                    }
                except:
                    return {
                        "statusCode": 200,
                        "headers": {"Content-Type": "application/json"},
                        "body": json.dumps({"success": "invalid"})
                    }

        # If method not POST
        return {
            "statusCode": 405,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Method not allowed"})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
