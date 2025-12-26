// client/src/components/AppFooter.jsx
export default function AppFooter() {
  return (
    <footer
      style={{
        marginTop: 24,
        paddingTop: 12,
        borderTop: "1px solid #1f2937",
        fontSize: 11,
        color: "#6b7280"
      }}
    >
      SRM Financial · Paper trading and analytics only ·
      {" "}{new Date().getFullYear()}
    </footer>
  );
}
