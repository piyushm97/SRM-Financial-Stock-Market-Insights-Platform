from pathlib import Path

RET_PATH = Path("server/src/daily-returns.log")
OUT_PATH = Path("server/src/profit-factor.log")

def main():
    if not RET_PATH.exists():
        print("No daily-returns.log.")
        return

    lines = RET_PATH.read_text(encoding="utf-8").strip().splitlines()
    if len(lines) < 2:
        print("Not enough data.")
        return

    rets = [float(l.split("ret=")[1]) for l in lines]
    gross_profit = sum(r for r in rets if r > 0)
    gross_loss = -sum(r for r in rets if r < 0)

    pf = gross_profit / gross_loss if gross_loss > 0 else float("inf")
    ts = lines[-1].split(",")[0]
    out = f"{ts},profit_factor={pf:.4f}\n"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(out)
    print("Appended profit factor:", out.strip())

if __name__ == "__main__":
    main()
