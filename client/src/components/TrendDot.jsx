// client/src/components/TrendDot.jsx
export default function TrendDot({ change }) {
  const positive = change >= 0;
  const color = positive ? "#22c55e" : "#ef4444";
  const title = positive ? "Up" : "Down";

  return (
    <span
      title={title}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color
      }}
    />
  );
}
