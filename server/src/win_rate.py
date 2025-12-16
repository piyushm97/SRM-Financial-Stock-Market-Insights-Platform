from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/win-rate.log")

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    rets = [float(l.split("ret=")[1]) for l in lines]
    if not rets:
        return

    wins = sum(1 for r in rets if r > 0)
    win_rate = wins / len(rets)
    ts = lines[-1].split(",")[0]
    out = f"{ts},trades={len(rets)},win_rate={win_rate:.4f}\n"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(out)
    print("Appended win rate:", out.strip())

if __name__ == "__main__":
    main()
