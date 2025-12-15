from pathlib import Path
from datetime import datetime

ROOT = Path("server/src")
OUT = ROOT / "stats-summary.txt"

files = {
    "equity_curve": ROOT / "equity-curve.log",
    "sharpe": ROOT / "sharpe-ratio.log",
    "risk_flag": ROOT / "daily-risk-flag.log",
}

def last_line(p: Path):
    if not p.exists():
        return "no data"
    return p.read_text(encoding="utf-8").strip().splitlines()[-1]

def main():
    now = datetime.utcnow().isoformat()
    lines = [f"SRM Stats Summary at {now}", ""]
    for name, path in files.items():
        lines.append(f"{name}: {last_line(path)}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Updated stats-summary.txt")

if __name__ == "__main__":
    main()
