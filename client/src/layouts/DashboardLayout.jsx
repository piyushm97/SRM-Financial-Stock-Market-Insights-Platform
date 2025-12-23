// client/src/layouts/DashboardLayout.jsx
export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020617" }}>
      <aside style={{ width: 220, padding: 16, borderRight: "1px solid #1f2937" }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <header style={{ marginBottom: 16 }}>{header}</header>
        {children}
      </main>
    </div>
  );
}
