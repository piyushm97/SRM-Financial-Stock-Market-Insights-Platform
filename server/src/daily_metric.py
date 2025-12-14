# server/src/daily_metric.py
from datetime import datetime
from pathlib import Path

LOG_PATH = Path("server/src/daily-price.log")
METRICS_PATH = Path("server/src/daily-metrics.log")

def compute_metric():
    if not LOG_PATH.exists():
        return "no-price-data"

    last_line = LOG_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]
    # very lightweight metric: just length of line as a proxy for payload size
    length = len(last_line)
    return f"len={length}"

def main():
    metric = compute_metric()
    now = datetime.utcnow().isoformat()
    line = f"{now},metric={metric}\n"
    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with METRICS_PATH.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended daily metric:", line.strip())

if __name__ == "__main__":
    main()
