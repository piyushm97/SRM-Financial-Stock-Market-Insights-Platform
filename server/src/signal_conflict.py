from pathlib import Path
from datetime import datetime

ROOT = Path("server/src")
OUT = ROOT / "signal-conflict.log"

def last_state(path: Path, key: str):
    if not path.exists():
        return None
    line = path.read_text(encoding="utf-8").strip().splitlines()[-1]
    for part in line.split(","):
        if part.startswith(key + "="):
            return part.split("=", 1)[1]
    return None

def main():
    ma_state = last_state(ROOT / "ma-crossover-signal.log", "state")
    trend_line = (ROOT / "trend-state.log").read_text(encoding="utf-8").strip().splitlines()[-1] if (ROOT / "trend-state.log").exists() else ""
    trend_state = None
    if "state=" in trend_line:
        trend_state = trend_line.split("state=")[1]

    now = datetime.utcnow().isoformat()
    conflict = ma_state is not None and trend_state is not None and ma_state != trend_state
    line = f"{now},ma_state={ma_state},trend_state={trend_state},conflict={conflict}\n"

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended signal conflict row:", line.strip())

if __name__ == "__main__":
    main()
