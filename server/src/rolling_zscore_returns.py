from pathlib import Path
import math

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/rolling-zscore-returns.log")
WINDOW = 20

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    if len(lines) < WINDOW:
        print("Not enough data.")
        return

    vals = [float(l.split("ret=")[1]) for l in lines]
    ts = [l.split(",")[0] for l in lines]
    out = []

    for i in range(WINDOW - 1, len(vals)):
        w = vals[i - WINDOW + 1 : i + 1]
        mean = sum(w) / WINDOW
        var = sum((x - mean) ** 2 for x in w) / WINDOW
        std = math.sqrt(var) or 1e-9
        z = (vals[i] - mean) / std
        out.append(f"{ts[i]},window={WINDOW},z={z:.4f}")

    OUT_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("Updated rolling-zscore-returns.log")

if __name__ == "__main__":
    main()
