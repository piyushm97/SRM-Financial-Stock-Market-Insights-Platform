from pathlib import Path
import random
import statistics
from datetime import datetime

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/monte-carlo-equity.log")

SIMS = 100
DAYS = 30
START = 1000.0

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    rets = [
        float(l.split("ret=")[1])
        for l in RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    ]
    if not rets:
        print("No returns to sample.")
        return

    terminals = []
    for _ in range(SIMS):
        eq = START
        for _ in range(DAYS):
            r = random.choice(rets)
            eq *= 1 + r
        terminals.append(eq)

    avg = statistics.mean(terminals)
    p5 = sorted(terminals)[int(0.05 * SIMS)]
    p95 = sorted(terminals)[int(0.95 * SIMS)]

    ts = datetime.utcnow().isoformat()
    line = f"{ts},sims={SIMS},days={DAYS},mean={avg:.2f},p5={p5:.2f},p95={p95:.2f}\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended Monte Carlo snapshot:", line.strip())

if __name__ == "__main__":
    main()
