type Props = {
    label:   string;
    healthy: boolean;
};

export default function HealthCard({ label, healthy }: Props) {
    return (
        <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
                background: "var(--surface)",
                border:     `1px solid ${healthy ? "var(--border)" : "rgba(248,113,113,0.3)"}`,
            }}
        >
            <span
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
            >
                {label}
            </span>

            <span
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: healthy ? "var(--success)" : "var(--danger)" }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                        background: healthy ? "var(--success)" : "var(--danger)",
                        boxShadow:  healthy
                            ? "0 0 6px var(--success)"
                            : "0 0 6px var(--danger)",
                    }}
                />
                {healthy ? "Healthy" : "Down"}
            </span>
        </div>
    );
}