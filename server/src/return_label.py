from pathlib import Path

Z_PATH = Path("server/src/rolling-zscore-returns.log")
OUT_PATH = Path("server/src/return-labels.log")
THRESH = 2.0

def main():
    if not Z_PATH.exists():
        print("No rolling-zscore-returns.log.")
        return

    lines = Z_PATH.read_text(encoding="utf-8").strip().splitlines()
    if not lines:
        return

    ts, rest = lines[-1].split(",", 1)
    z = float(rest.split("z=")[1])
    label = "OUTLIER" if abs(z) > THRESH else "NORMAL"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},z={z:.4f},label={label}\n")
    print("Appended return label:", label)

if __name__ == "__main__":
    main()
