import MetricCard from "../components/MetricCard";
import { useMetrics } from "../hooks/useMetrics";
import TransactionFeed from "../components/TransactionFeed";
import {    useRecentTransactions   } from "../hooks/useRecentTransactions";

export default function Dashboard() {
    const metrics = useMetrics();
    const transactions = useRecentTransactions();

  if (!metrics) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SentinelLedger Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem"
        }}
      >
        <MetricCard
          title="Accounts"
          value={metrics.accounts}
        />

        <MetricCard
          title="Fraud Events"
          value={metrics.fraudEvents}
        />

        <MetricCard
          title="Blacklisted"
          value={metrics.blacklisted}
        />
        
        <TransactionFeed
            transactions={transactions}
        />
      </div>
    </div>
  );
}