from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/down-streak.log")

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    if not lines:
        return

    rets = [float(l.split("ret=")[1]) for l in lines]
    streak = 0
    for r in reversed(rets):
        if r < 0:
            streak += 1
        else:
            break

    ts = lines[-1].split(",")[0]
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},down_streak_days={streak}\n")
    print("Appended down streak:", streak)

if __name__ == "__main__":
    main()
