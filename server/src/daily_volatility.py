# server/src/daily_volatility.py
# Uses the lengths of daily-price.log entries as a toy price proxy
# and computes rolling standard deviation as "volatility".

from pathlib import Path
from datetime import datetime
import math

LOG_PATH = Path("server/src/daily-price.log")
OUT_PATH = Path("server/src/daily-volatility.log")
WINDOW = 5  # last 5 entries

def load_series():
    if not LOG_PATH.exists():
        return []
    lines = LOG_PATH.read_text(encoding="utf-8").strip().splitlines()
    series = []
    for line in lines:
        ts = line.split(",")[0]
        value = len(line)
        series.append((ts, value))
    return series

def rolling_volatility(series, window):
    if len(series) < window:
        return None
    window_data = [v for _, v in series[-window:]]
    mean = sum(window_data) / window
    var = sum((x - mean) ** 2 for x in window_data) / window
    return math.sqrt(var)

def main():
    series = load_series()
    vol = rolling_volatility(series, WINDOW)
    if vol is None:
        print("Not enough data for volatility yet.")
        return
    ts = series[-1][0]
    line = f"{ts},window={WINDOW},vol={vol:.4f}\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended volatility:", line.strip())

if __name__ == "__main__":
    main()
