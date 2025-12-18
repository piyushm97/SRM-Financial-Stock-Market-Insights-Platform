from pathlib import Path
from datetime import datetime

ROOT = Path("server/src")
MC_PATH = ROOT / "monte-carlo-equity.log"
EQ_PATH = ROOT / "equity-curve.log"
OUT = ROOT / "mc-sanity.log"

def last_field(line: str, key: str):
    for part in line.split(","):
        if part.startswith(key + "="):
            return float(part.split("=", 1)[1])
    return None

def main():
    if not MC_PATH.exists() or not EQ_PATH.exists():
        print("Missing MC or equity data.")
        return

    mc_line = MC_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]
    eq_line = EQ_PATH.read_text(encoding="utf-8").strip().splitlines()[-1]

    mc_mean = last_field(mc_line, "mean")
    eq = float(eq_line.split("equity=")[1])

    diff = (mc_mean - eq) / eq if eq != 0 else 0.0
    now = datetime.utcnow().isoformat()
    line = f"{now},mc_mean={mc_mean:.2f},equity={eq:.2f},rel_diff={diff:.4f}\n"

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("a", encoding="utf-8") as f:
        f.write(line)
    print("Appended MC sanity row:", line.strip())

if __name__ == "__main__":
    main()
