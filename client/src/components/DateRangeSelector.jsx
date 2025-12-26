// client/src/components/DateRangeSelector.jsx
const options = [1, 5, 30, 90, 365];

export default function DateRangeSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: "1px solid #4b5563",
            background: d === value ? "#4b5563" : "transparent",
            color: "#e5e7eb",
            fontSize: 11
          }}
        >
          {d === 1
            ? "1D"
            : d === 5
            ? "5D"
            : d === 30
            ? "1M"
            : d === 90
            ? "3M"
            : d === 365
            ? "1Y"
            : `${d}D`}
        </button>
      ))}
    </div>
  );
}
