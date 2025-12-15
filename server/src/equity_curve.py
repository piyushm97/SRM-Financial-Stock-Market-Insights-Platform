from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/equity-curve.log")

START_CAPITAL = 1000.0

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log yet.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    equity = START_CAPITAL
    out_lines = []

    for line in lines:
        ts, rest = line.split(",", 1)
        r = float(rest.split("ret=")[1])
        equity *= (1.0 + r)
        out_lines.append(f"{ts},equity={equity:.2f}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print("Rebuilt equity-curve.log with", len(out_lines), "points.")

if __name__ == "__main__":
    main()
