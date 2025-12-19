from pathlib import Path

Z_PATH = Path("server/src/rolling-zscore-returns.log")
OUT_PATH = Path("server/src/zscore-anomalies.log")
THRESH = 2.0

def main():
    if not Z_PATH.exists():
        print("No rolling-zscore-returns.log.")
        return

    lines = Z_PATH.read_text(encoding="utf-8").strip().splitlines()
    if not lines:
        return

    last = lines[-1]
    ts, rest = last.split(",", 1)
    z = float(rest.split("z=")[1])
    is_anom = abs(z) > THRESH
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},z={z:.4f},anomaly={is_anom}\n")
    print("Appended z-score anomaly row.")

if __name__ == "__main__":
    main()
