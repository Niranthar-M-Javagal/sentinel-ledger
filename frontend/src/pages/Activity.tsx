import Layout from "../components/Layout";
import { useActivityFeed } from "../hooks/useActivityFeed";

const EVENT_TYPE_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
    transaction: { bg: "rgba(124,92,252,0.08)", color: "var(--accent-text)", dot: "var(--accent)" },
    fraud:       { bg: "rgba(248,113,113,0.08)", color: "var(--danger)",      dot: "var(--danger)"  },
    blacklist:   { bg: "rgba(251,191,36,0.08)",  color: "var(--warning)",     dot: "var(--warning)" },
};

export default function Activity() {
    const events = useActivityFeed();

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">

                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Activity Feed
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        Live platform events
                    </p>
                </div>

                <div className="space-y-2">
                    {events.map((event, index) => {
                        const style = EVENT_TYPE_COLORS[event.type] ?? EVENT_TYPE_COLORS.transaction;

                        return (
                            <div
                                key={index}
                                className="rounded-xl px-4 py-3"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                        style={{ background: style.bg, color: style.color }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ background: style.dot }} />
                                        {event.type}
                                    </span>
                                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        {new Date(event.timestamp).toLocaleString(undefined, {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit", second: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <pre
                                    className="text-xs rounded-lg p-3 overflow-x-auto"
                                    style={{
                                        background:  "var(--surface-hover)",
                                        color:       "var(--text-secondary)",
                                        fontFamily:  "'SF Mono', 'Fira Code', monospace",
                                        lineHeight:  1.6,
                                        border:      "1px solid var(--border-subtle)",
                                    }}
                                >
                                    {JSON.stringify(event.data, null, 2)}
                                </pre>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}