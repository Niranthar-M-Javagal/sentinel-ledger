interface MetricCardProps {
    title: string;
    value: number;
    delta?: { value: string; up: boolean };
}

export default function MetricCard({ title, value, delta }: MetricCardProps) {
    return (
        <div
            className="rounded-2xl px-6 py-5 transition-all"
            style={{
                background: "var(--surface)",
                border:     "1px solid var(--border)",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--surface-hover)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#3d3830";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
            }}
        >
            <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-secondary)" }}
            >
                {title}
            </p>

            <p
                className="text-4xl font-bold tabular-nums"
                style={{ color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1 }}
            >
                {value.toLocaleString()}
            </p>

            {delta && (
                <p
                    className="text-xs font-medium mt-2"
                    style={{ color: delta.up ? "var(--success)" : "var(--danger)" }}
                >
                    {delta.up ? "↑" : "↓"} {delta.value}
                </p>
            )}

            {/* Accent underline */}
            <div
                className="mt-4 h-px w-8 rounded-full"
                style={{ background: "var(--accent)", opacity: 0.5 }}
            />
        </div>
    );
}