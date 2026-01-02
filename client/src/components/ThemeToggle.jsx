// client/src/components/ThemeToggle.jsx
import { useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.style.background = dark ? "#f3f4f6" : "#020617";
    document.body.style.color = dark ? "#111827" : "#e5e7eb";
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #4b5563",
        background: "transparent",
        color: "#e5e7eb",
        fontSize: 12,
        cursor: "pointer"
      }}
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
