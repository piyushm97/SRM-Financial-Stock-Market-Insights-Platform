// client/src/components/PerformanceChart.jsx
export default function PerformanceChart({ data }) {
  if (!data || !data.length) return <p>No data</p>;
  
  const max = Math.max(...data.map((d) => d.value));
  const height = 100;

  return (
    <svg width="100%" height={height} style={{ background: "#020617" }}>
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - (d.value / max) * height;
        return (
          ircle key={i} cx={`${x}%`} cy={y} r="2" fill="#22c55e" />
        );
      })}
    </svg>
  );
}
