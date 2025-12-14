# server/src/correlation_snapshot.py
# Correlates recent moving-average and volatility values as a toy metric.

from pathlib import Path
import math
from datetime import datetime

MA_PATH = Path("server/src/daily-moving-average.log")
VOL_PATH = Path("server/src/daily-volatility.log")
OUT_PATH = Path("server/src/correlation-snapshot.log")

def load_values(p: Path, key: str):
    if not p.exists():
        return []
    vals = []
    for line in p.read_text(encoding="utf-8").strip().splitlines():
        parts = line.split(",")
        ts = parts[0]
        kv = {k.split("=")[0]: k.split("=")[1] for k in parts[1:] if "=" in k}
        if key in kv:
            vals.append((ts, float(kv[key])))
    return vals

def pearson(xs, ys):
    n = len(xs)
    if n == 0 or len(ys) != n:
        return None
    mx = sum(xs) / n
    my = sum(ys) / n
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sx = math.sqrt(sum((x - mx) ** 2 for x in xs))
    sy = math.sqrt(sum((y - my) ** 2 for y in ys))
    if sx == 0 or sy == 0:
        return None
    return cov / (sx * sy)

def main():
    ma = load_values(MA_PATH, "sma")
    vol = load_values(VOL_PATH, "vol")
    # align by index (they are both daily series)
    n = min(len(ma), len(vol), 10)
    if n < 3:
        print("Not enough data for correlation.")
        return
    xs = [v for _, v in ma[-n:]]
    ys = [v for _, v in vol[-n:]]
    r = pearson(xs, ys)
    if r is None:
        print("Correlation undefined.")
        return
    ts = datetime.utcnow().isoformat()
    line = f"{ts},n={n},corr={r:.4f}\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(OUT_PATH.read_text(encoding="utf-8") + line if OUT_PATH.exists() else line, encoding="utf-8")
    print("Appended correlation snapshot:", line.strip())

if __name__ == "__main__":
    main()
