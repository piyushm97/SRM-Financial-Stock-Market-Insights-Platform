// client/src/components/PageHeader.jsx
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: "1px solid #1f2937"
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "#9ca3af" }}>{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
