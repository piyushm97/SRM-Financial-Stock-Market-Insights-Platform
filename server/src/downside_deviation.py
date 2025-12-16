from pathlib import Path
import math

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/downside-deviation.log")

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    rets = [float(l.split("ret=")[1]) for l in lines]
    negatives = [min(r, 0.0) for r in rets]
    if not negatives:
        print("No negative returns.")
        return

    mean = sum(negatives) / len(negatives)
    var = sum((x - mean) ** 2 for x in negatives) / len(negatives)
    dd = math.sqrt(var)

    ts = lines[-1].split(",")[0]
    out = f"{ts},downside_dev={dd:.6f}\n"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(out)
    print("Appended downside deviation:", out.strip())

if __name__ == "__main__":
    main()
