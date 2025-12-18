from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/returns-percentiles.log")

def percentile(sorted_vals, p):
    if not sorted_vals:
        return 0.0
    k = int(p * (len(sorted_vals) - 1))
    return sorted_vals[k]

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    vals = sorted(float(l.split("ret=")[1]) for l in lines)
    p05 = percentile(vals, 0.05)
    p50 = percentile(vals, 0.50)
    p95 = percentile(vals, 0.95)
    ts = lines[-1].split(",")[0]

    line = f"{ts},p05={p05:.6f},p50={p50:.6f},p95={p95:.6f}\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended returns percentiles:", line.strip())

if __name__ == "__main__":
    main()
