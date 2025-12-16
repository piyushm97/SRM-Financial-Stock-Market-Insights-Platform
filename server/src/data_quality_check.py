from pathlib import Path
from datetime import datetime

ROOT = Path("server/src")
OUT = ROOT / "data-quality.log"

LOGS = [
    "daily-price.log",
    "daily-returns.log",
    "equity-curve.log",
    "sharpe-ratio.log",
]

def main():
    lines = [f"Data quality check at {datetime.utcnow().isoformat()}", ""]
    for name in LOGS:
        p = ROOT / name
        if not p.exists():
            lines.append(f"{name}: MISSING")
            continue
        content = p.read_text(encoding="utf-8").strip().splitlines()
        status = "OK" if content else "EMPTY"
        lines.append(f"{name}: {status}, count={len(content)}")

    lines.append("")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("a", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("Appended data-quality entry")

if __name__ == "__main__":
    main()
