from pathlib import Path

ROLL_PATH = Path("server/src/rolling-avg-return.log")
OUT_PATH = Path("server/src/trend-state.log")

def main():
    if not ROLL_PATH.exists():
        print("No rolling-avg-return.log.")
        return

    line = ROLL_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]
    ts, rest = line.split(",", 1)
    avg_ret = float(rest.split("avg_ret=")[1])

    if avg_ret > 0.002:
        state = "UPTREND"
    elif avg_ret < -0.002:
        state = "DOWNTREND"
    else:
        state = "SIDEWAYS"

    out = f"{ts},avg_ret={avg_ret:.6f},state={state}\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(out)
    print("Appended trend state:", out.strip())

if __name__ == "__main__":
    main()
