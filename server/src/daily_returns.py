from pathlib import Path
from datetime import datetime

LOG_PATH = Path("server/src/daily-price.log")
OUT_PATH = Path("server/src/daily-returns.log")

def main():
    if not LOG_PATH.exists():
        print("No daily-price.log yet.")
        return

    lines = LOG_PATH.read_text(encoding="utf-8").strip().splitlines()
    if len(lines) < 2:
        print("Not enough data for returns.")
        return

    values = [len(l) for l in lines]  # toy price proxy
    rets = []
    for i in range(1, len(values)):
        prev, curr = values[i - 1], values[i]
        r = (curr - prev) / prev if prev != 0 else 0.0
        ts = lines[i].split(",")[0]
        rets.append((ts, r))

    last_ts, last_r = rets[-1]
    line = f"{last_ts},ret={last_r:.6f}\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended daily return:", line.strip())

if __name__ == "__main__":
    main()
