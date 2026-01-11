from pathlib import Path

SHAPE_PATH = Path("server/src/shape-stats.log")
OUT_PATH = Path("server/src/fat-tail-flag.log")

def main():
    if not SHAPE_PATH.exists():
        print("No shape-stats.log.")
        return

    line = SHAPE_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]
    ts, rest = line.split(",", 1)
    kurt = float(rest.split("kurtosis=")[1])
    flag = kurt > 3.0  # crude threshold vs normal

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},kurtosis={kurt:.4f},fat_tails={flag}\n")
    print("Appended fat-tail flag.")

if __name__ == "__main__":
    main()
