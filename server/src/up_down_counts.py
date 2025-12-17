from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/up-down-counts.log")
WINDOW = 10

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
        w = rets[i - WINDOW + 1 : i + 1]
        ups = sum(1 for r in w if r > 0)
        downs = sum(1 for r in w if r < 0)
        out_lines.append(f"{ts_list[i]},window={WINDOW},ups={ups},downs={downs}")

    OUT_PATH.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print("Updated up-down-counts.log")

if __name__ == "__main__":
    main()
