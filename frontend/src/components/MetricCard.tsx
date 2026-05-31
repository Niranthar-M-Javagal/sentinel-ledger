interface MetricCardProps {
  title: string;
  value: number;
}

export default function MetricCard({
  title,
  value
}: MetricCardProps) {
  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "1rem",
        minWidth: "200px"
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}