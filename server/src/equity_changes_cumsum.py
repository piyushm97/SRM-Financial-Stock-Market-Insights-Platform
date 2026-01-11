from pathlib import Path

EQ_PATH = Path("server/src/equity-curve.log")
OUT_PATH = Path("server/src/equity-changes-cumsum.log")

def main():
    if not EQ_PATH.exists():
        print("No equity-curve.log.")
        return

    lines = EQ_PATH.read_text(encoding="utf-8").strip().splitlines()
    if len(lines) < 2:
        return

    eq = []
    ts = []
    for line in lines:
        t, rest = line.split(",", 1)
        ts.append(t)
        eq.append(float(rest.split("equity=")[1]))

    deltas = [eq[i] - eq[i - 1] for i in range(1, len(eq))]
    cum = 0.0
    out_lines = []
    for t, d in zip(ts[1:], deltas):
        cum += d
        out_lines.append(f"{t},delta={d:.2f},cum_delta={cum:.2f}")

    OUT_PATH.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
    print("Updated equity-changes-cumsum.log")

if __name__ == "__main__":
    main()
