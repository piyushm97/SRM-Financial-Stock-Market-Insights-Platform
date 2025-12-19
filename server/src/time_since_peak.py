from pathlib import Path

DD_PATH = Path("server/src/drawdown-table.csv")
OUT_PATH = Path("server/src/time-since-peak.log")

def main():
    if not DD_PATH.exists():
        print("No drawdown-table.csv.")
        return

    lines = DD_PATH.read_text(encoding="utf-8").strip().splitlines()[1:]
    if not lines:
        return

    last_peak_idx = 0
    result_line = ""
    for idx, row in enumerate(lines):
        ts, _, _, dd = row.split(",")
        if float(dd) == 0.0:
            last_peak_idx = idx
        if idx == len(lines) - 1:
            days = idx - last_peak_idx
            result_line = f"{ts},days_since_peak={days}\n"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(result_line)
    print("Appended time-since-peak:", result_line.strip())

if __name__ == "__main__":
    main()
