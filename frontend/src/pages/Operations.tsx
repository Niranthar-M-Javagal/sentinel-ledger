import Layout from "../components/Layout";
import MetricCard from "../components/MetricCard";
import HealthCard from "../components/HealthCard";
import { useOperations } from "../hooks/useOperations";

export default function Operations() {
    const metrics = useOperations();

    if (!metrics) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64 text-sm"
                    style={{ color: "var(--text-muted)" }}>
                    Loading…
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto">

                <div className="mb-10">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Operations
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        System metrics and health
                    </p>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                    <MetricCard title="Transactions"  value={metrics.transactionsProcessed} />
                    <MetricCard title="Funding Ops"   value={metrics.fundingOperations}     />
                    <MetricCard title="Fraud Events"  value={metrics.fraudEvents}           />
                    <MetricCard title="Blacklisted"   value={metrics.blacklistedAccounts}   />
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ color: "var(--text-secondary)" }}>
                    System Health
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <HealthCard label="PostgreSQL"    healthy={metrics.health.postgres} />
                    <HealthCard label="Redis"         healthy={metrics.health.redis}    />
                    <HealthCard label="Fraud Worker"  healthy={metrics.health.worker}   />
                </div>

            </div>
        </Layout>
    );
}