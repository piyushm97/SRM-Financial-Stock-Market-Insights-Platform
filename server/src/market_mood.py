from pathlib import Path

ROOT = Path("server/src")
OUT = ROOT / "market-mood.log"

def last_int(path: Path, key: str):
    if not path.exists():
        return 0
    line = path.read_text(encoding="utf-8").strip().splitlines()[-1]
    return int(line.split(key + "=")[1])

def main():
    up = last_int(ROOT / "up-streak.log", "up_streak_days")
    down = last_int(ROOT / "down-streak.log", "down_streak_days")

    if up >= 3 and down == 0:
        mood = "BULLISH"
    elif down >= 3 and up == 0:
        mood = "BEARISH"
    else:
        mood = "MIXED"

    ts = (ROOT / "up-streak.log").read_text(encoding="utf-8").strip().splitlines()[-1].split(",")[0] if (ROOT / "up-streak.log").exists() else "n/a"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("a", encoding="utf-8") as f:
        f.write(f"{ts},up={up},down={down},mood={mood}\n")
    print("Appended market mood:", mood)

if __name__ == "__main__":
    main()
