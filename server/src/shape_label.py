from pathlib import Path

SHAPE_PATH = Path("server/src/shape-stats.log")
OUT_PATH = Path("server/src/shape-label.log")

def parse(line, key):
    for part in line.split(","):
        if part.startswith(key + "="):
            return float(part.split("=")[1])
    return 0.0

def main():
    if not SHAPE_PATH.exists():
        print("No shape-stats.log.")
        return

    line = SHAPE_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]
    ts = line.split(",")[0]
    s = parse(line, "skew")
    k = parse(line, "kurtosis")

    if s > 0.5:
        skew_label = "RIGHT_SKEW"
    elif s < -0.5:
        skew_label = "LEFT_SKEW"
    else:
        skew_label = "NEAR_SYMM"

    tail_label = "FAT_TAILS" if k > 3 else "NORMAL_TAILS"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},skew_label={skew_label},tail_label={tail_label}\n")
    print("Appended shape label.")

if __name__ == "__main__":
    main()
