from pathlib import Path

EQ_PATH = Path("server/src/equity-curve.log")  # using equity as proxy price
OUT_PATH = Path("server/src/ma-crossover-signal.log")

SHORT = 5
LONG = 20

def main():
    if not EQ_PATH.exists():
        print("No equity-curve.log.")
        return

    lines = EQ_PATH.read_text(encoding="utf-8").strip().splitlines()
    prices = []
    ts_list = []
    for line in lines:
        ts, rest = line.split(",", 1)
        price = float(rest.split("equity=")[1])
        ts_list.append(ts)
        prices.append(price)

    n = len(prices)
    if n < LONG:
        print("Not enough data.")
        return

    def sma(window, i):
        vals = prices[i - window + 1 : i + 1]
        return sum(vals) / len(vals)

    states = []
    for i in range(LONG - 1, n):
        short = sma(SHORT, i)
        long = sma(LONG, i)
        if short > long:
            states.append("LONG")
        elif short < long:
            states.append("FLAT")
        else:
            states.append("NEUTRAL")

    ts = ts_list[-1]
    last_state = states[-1]
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(f"{ts},short={SHORT},long={LONG},state={last_state}\n")
    print("Appended MA crossover state:", last_state)

if __name__ == "__main__":
    main()
