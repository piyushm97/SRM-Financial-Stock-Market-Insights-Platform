// client/src/components/ErrorBanner.jsx
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        background: "#7f1d1d",
        color: "#fee2e2",
        fontSize: 13
      }}
    >
      {message}
    </div>
  );
}
