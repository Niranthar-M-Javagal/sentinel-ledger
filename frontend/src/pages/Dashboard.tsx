import Layout from "../components/Layout";
import MetricCard from "../components/MetricCard";
import { useMetrics } from "../hooks/useMetrics";
import { useRecentTransactions } from "../hooks/useRecentTransactions";
import { useRecentFraud } from "../hooks/useRecentFraud";

export default function Dashboard() {
    const metrics = useMetrics();
    const { transactions } = useRecentTransactions();
    const { fraudEvents }  = useRecentFraud();

    if (!metrics) {
        return (
            <Layout>
                <div
                    className="flex items-center justify-center h-64 text-sm"
                    style={{ color: "var(--text-muted)" }}
                >
                    Loading…
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Dashboard
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        Distributed Fintech Platform
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <MetricCard title="Accounts"     value={metrics.accounts}    />
                    <MetricCard title="Fraud Events" value={metrics.fraudEvents} />
                    <MetricCard title="Blacklisted"  value={metrics.blacklisted} />
                </div>

                {/* Panels */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* Transactions */}
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: "var(--surface)",
                            border:     "1px solid var(--border)",
                        }}
                    >
                        <h2
                            className="text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Recent Transactions
                        </h2>

                        <div className="space-y-2">
                            {transactions.slice(0, 5).map(tx => (
                                <div
                                    key={tx.transactionId}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                                    style={{
                                        background: "var(--surface-hover)",
                                        border:     "1px solid var(--border-subtle)",
                                    }}
                                >
                                    <span
                                        className="text-xs font-mono truncate"
                                        style={{ color: "var(--text-muted)", maxWidth: "60%" }}
                                    >
                                        {tx.transactionId}
                                    </span>
                                    <span
                                        className="text-sm font-semibold tabular-nums"
                                        style={{ color: "var(--text)" }}
                                    >
                                        ₹{tx.amount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fraud */}
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: "var(--surface)",
                            border:     "1px solid var(--border)",
                        }}
                    >
                        <h2
                            className="text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Fraud Alerts
                        </h2>

                        <div className="space-y-2">
                            {fraudEvents.slice(0, 5).map(event => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                                    style={{
                                        background: "rgba(248,113,113,0.06)",
                                        border:     "1px solid rgba(248,113,113,0.2)",
                                    }}
                                >
                                    <span
                                        className="text-sm font-medium truncate"
                                        style={{ color: "var(--text)", maxWidth: "70%" }}
                                    >
                                        {event.reason}
                                    </span>
                                    <span
                                        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                                        style={{
                                            background: "rgba(248,113,113,0.12)",
                                            color:      "var(--danger)",
                                        }}
                                    >
                                        {event.transaction_count} txns
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}