from pathlib import Path

ROOT = Path("server/src")
OUT = ROOT / "risk-score.log"

def last_float(path: Path, key: str):
    if not path.exists():
        return None
    line = path.read_text(encoding="utf-8").strip().splitlines()[-1]
    if key not in line:
        return None
    return float(line.split(key + "=")[1].split(",")[0])

def main():
    sharpe = last_float(ROOT / "sharpe-ratio.log", "sharpe_daily")
    mdd = last_float(ROOT / "max-drawdown.log", "max_drawdown")
    vol = last_float(ROOT / "rolling-volatility-returns.log", "vol")

    if sharpe is None or mdd is None or vol is None:
        print("Missing inputs.")
        return

    # crude composite: lower is worse
    score = (1 - sharpe) + abs(mdd) + vol
    ts_line = ROOT.joinpath("sharpe-ratio.log").read_text(encoding="utf-8").strip().splitlines()[-1]
    ts = ts_line.split(",")[0]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("a", encoding="utf-8") as f:
        f.write(f"{ts},score={score:.4f}\n")
    print("Appended risk score.")

if __name__ == "__main__":
    main()
