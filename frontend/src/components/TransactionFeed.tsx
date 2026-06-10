import type { TransactionEvent } from "../types/events";

interface Props {
    transactions: TransactionEvent[];
}

export default function TransactionFeed({ transactions }: Props) {
    return (
        <div>
            <h2
                className="text-sm font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-secondary)" }}
            >
                Recent Transactions
            </h2>

            <div className="space-y-2">
                {transactions.map(tx => (
                    <div
                        key={tx.transactionId}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{
                            background: "var(--surface)",
                            border:     "1px solid var(--border)",
                        }}
                    >
                        {/* Amount */}
                        <span
                            className="text-sm font-semibold tabular-nums flex-shrink-0"
                            style={{ color: "var(--text)", minWidth: "80px" }}
                        >
                            ₹{tx.amount.toLocaleString("en-IN")}
                        </span>

                        {/* From → To */}
                        <span
                            className="text-xs font-mono truncate"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {tx.fromAccount}
                        </span>

                        <span
                            className="text-xs flex-shrink-0"
                            style={{ color: "var(--text-muted)" }}
                        >
                            →
                        </span>

                        <span
                            className="text-xs font-mono truncate"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {tx.toAccount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}