// client/src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2px solid #4b5563",
          borderTopColor: "#22c55e",
          animation: "spin 0.8s linear infinite"
        }}
      />
      <span style={{ fontSize: 12, color: "#9ca3af" }}>{label}</span>
    </div>
  );
}
