from pathlib import Path

VOL_PATH = Path("server/src/rolling-volatility-returns.log")
OUT_PATH = Path("server/src/vol-regime.log")

def main():
    if not VOL_PATH.exists():
        print("No rolling-volatility-returns.log.")
        return

    line = VOL_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]
    ts, rest = line.split(",", 1)
    vol = float(rest.split("vol=")[1])

    if vol < 0.005:
        regime = "CALM"
    elif vol < 0.02:
        regime = "NORMAL"
    else:
        regime = "VOLATILE"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},vol={vol:.6f},regime={regime}\n")
    print("Appended vol regime:", regime)

if __name__ == "__main__":
    main()
