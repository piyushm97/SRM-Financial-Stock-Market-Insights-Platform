from pathlib import Path
import math

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/rolling-volatility-returns.log")
WINDOW = 5

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    if len(lines) < WINDOW:
        print("Not enough data.")
        return

    rets = [float(l.split("ret=")[1]) for l in lines]
    ts_list = [l.split(",")[0] for l in lines]
    out_lines = []

    for i in range(WINDOW - 1, len(rets)):
        window = rets[i - WINDOW + 1 : i + 1]
        mean = sum(window) / WINDOW
        var = sum((x - mean) ** 2 for x in window) / WINDOW
        std = math.sqrt(var)
        out_lines.append(f"{ts_list[i]},window={WINDOW},vol={std:.6f}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print("Updated rolling-volatility-returns.log")

if __name__ == "__main__":
    main()
