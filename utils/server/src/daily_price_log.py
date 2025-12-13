# server/src/daily_price_log.py
import requests
from datetime import datetime
import os

API_KEY = os.getenv("ALPHA_VANTAGE_KEY")
SYMBOL = os.getenv("SRM_WATCH_SYMBOL", "AAPL")

url = (
    "https://www.alphavantage.co/query"
    f"?function=TIME_SERIES_INTRADAY&symbol={SYMBOL}&interval=5min&apikey={API_KEY}"
)
r = requests.get(url)
data = r.json()

now = datetime.utcnow().isoformat()
line = f"{now},symbol={SYMBOL},raw_keys={list(data.keys())[:3]}\n"

log_path = "server/src/daily-price.log"
with open(log_path, "a", encoding="utf-8") as f:
  f.write(line)

print("Logged daily price metadata line.")
