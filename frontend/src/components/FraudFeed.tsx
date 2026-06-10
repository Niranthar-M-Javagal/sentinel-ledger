import type { FraudEvent } from "../types/fraud";

interface Props {
    fraudEvents: FraudEvent[];
}

export default function FraudFeed({ fraudEvents }: Props) {
    return (
        <div>
            <h2
                className="text-sm font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-secondary)" }}
            >
                Fraud Events
            </h2>

            <div className="space-y-2">
                {fraudEvents.map(event => (
                    <div
                        key={event.id}
                        className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl"
                        style={{
                            background:  "rgba(248,113,113,0.06)",
                            border:      "1px solid rgba(248,113,113,0.2)",
                        }}
                    >
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-sm font-medium truncate"
                                style={{ color: "var(--text)" }}
                            >
                                {event.reason}
                            </div>
                            <div
                                className="text-xs mt-0.5 font-mono truncate"
                                style={{ color: "var(--text-muted)" }}
                            >
                                {event.account_id}
                            </div>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0 gap-1">
                            <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                    background: "rgba(248,113,113,0.12)",
                                    color:      "var(--danger)",
                                }}
                            >
                                {event.transaction_count} txns
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: "var(--text-muted)" }}
                            >
                                {new Date(event.created_at).toLocaleString(undefined, {
                                    month:  "short",
                                    day:    "numeric",
                                    hour:   "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}