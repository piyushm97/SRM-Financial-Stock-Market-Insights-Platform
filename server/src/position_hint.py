from pathlib import Path

ROOT = Path("server/src")
OUT = ROOT / "position-hint.log"

def last_field(path: Path, key: str):
    if not path.exists():
        return None
    line = path.read_text(encoding="utf-8").strip().splitlines()[-1]
    if key not in line:
        return None
    return line.split(key + "=")[1].split(",")[0]

def main():
    trend = last_field(ROOT / "trend-state.log", "state")
    regime = last_field(ROOT / "vol-regime.log", "regime")

    if not trend or not regime:
        print("Missing trend or vol regime.")
        return

    if trend == "UPTREND" and regime in ("CALM", "NORMAL"):
        pos = "OVERWEIGHT"
    elif trend == "DOWNTREND" and regime == "VOLATILE":
        pos = "UNDERWEIGHT"
    else:
        pos = "NEUTRAL"

    ts = last_field(ROOT / "trend-state.log", "state")  # reuse ts via that line context
    line = f"{ts},trend={trend},regime={regime},position={pos}\n"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended position hint:", line.strip())

if __name__ == "__main__":
    main()
