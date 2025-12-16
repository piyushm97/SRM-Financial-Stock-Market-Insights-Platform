from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/rolling-avg-return.log")
WINDOW = 3

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    if len(lines) < WINDOW:
        print("Not enough data.")
        return

    vals = [float(l.split("ret=")[1]) for l in lines]
    ts_list = [l.split(",")[0] for l in lines]
    out_lines = []

    for i in range(WINDOW - 1, len(vals)):
        window_vals = vals[i - WINDOW + 1 : i + 1]
        avg = sum(window_vals) / WINDOW
        out_lines.append(f"{ts_list[i]},window={WINDOW},avg_ret={avg:.6f}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print("Updated rolling-avg-return.log with", len(out_lines), "rows")

if __name__ == "__main__":
    main()
