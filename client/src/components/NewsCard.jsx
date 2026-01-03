// client/src/components/NewsCard.jsx
export default function NewsCard({ title, source, url, publishedAt }) {
  return (
    <div style={{ padding: 12, background: "#111827", borderRadius: 8, border: "1px solid #1f2937" }}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb", textDecoration: "none" }}>
        {title}
      </a>
      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
        {source} · {new Date(publishedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
