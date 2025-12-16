from pathlib import Path
from datetime import datetime

OUT = Path("server/src/valuation-note.txt")

def main():
    now = datetime.utcnow().isoformat()
    note = [
        f"Valuation note generated at {now}",
        "",
        "- This is a placeholder note for SRM Financial.",
        "- Hook this up later to real valuation ratios (P/E, P/B, etc.).",
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(note) + "\n", encoding="utf-8")
    print("Updated valuation-note.txt")

if __name__ == "__main__":
    main()
