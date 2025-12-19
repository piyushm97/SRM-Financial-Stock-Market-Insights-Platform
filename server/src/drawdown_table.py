from pathlib import Path

EQ_PATH = Path("server/src/equity-curve.log")
OUT_PATH = Path("server/src/drawdown-table.csv")

def main():
    if not EQ_PATH.exists():
        print("No equity-curve.log.")
        return

    lines = EQ_PATH.read_text(encoding="utf-8").strip().splitlines()
    if not lines:
        return

    ts = []
    eq = []
    for line in lines:
        t, rest = line.split(",", 1)
        ts.append(t)
        eq.append(float(rest.split("equity=")[1]))

    peak = eq[0]
    rows = ["timestamp,equity,peak,drawdown"]
    for t, v in zip(ts, eq):
        peak = max(peak, v)
        dd = (v - peak) / peak if peak != 0 else 0.0
        rows.append(f"{t},{v:.2f},{peak:.2f},{dd:.4f}")

    OUT_PATH.write_text("\n".join(rows) + "\n", encoding="utf-8")
    print("Wrote drawdown-table.csv")

if __name__ == "__main__":
    main()
