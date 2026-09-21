import os
from datetime import datetime
from zoneinfo import ZoneInfo

def write_error_log(message: str, path: str = "be/log/dilog.log"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tz = ZoneInfo("Europe/Rome")
    timestamp = datetime.now(tz=tz).isoformat()
    with open(path, "a", encoding="utf-8") as f:
        f.write(f"{timestamp} ERROR: {message}\n")