import Layout from "../components/Layout";
import MetricCard from "../components/MetricCard";

import { useMetrics } from "../hooks/useMetrics";
import { useRecentTransactions } from "../hooks/useRecentTransactions";
import { useRecentFraud } from "../hooks/useRecentFraud";

export default function Dashboard() {

    const metrics = useMetrics();

    const {
        transactions
    } = useRecentTransactions();

    const {
        fraudEvents
    } = useRecentFraud();

    if (!metrics) {
        return <h2>Loading...</h2>;
    }

    const recentTransactions =
        transactions.slice(0, 5);

    const recentFraud =
        fraudEvents.slice(0, 5);

    return (
        <Layout>

            <h1>
                SentinelLedger Dashboard
            </h1>

            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "2rem",
                    marginBottom: "2rem"
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
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "3rem",
                    alignItems: "flex-start"
                }}
            >
                <div>
                    <h2>
                        Recent Transactions
                    </h2>

                    {recentTransactions.map(tx => (

                        <div
                            key={tx.transactionId}
                            style={{
                                border: "1px solid #333",
                                padding: "0.75rem",
                                marginBottom: "0.5rem",
                                borderRadius: "8px"
                            }}
                        >
                            <div>
                                ₹{tx.amount}
                            </div>

                            <div>
                                {tx.transactionId}
                            </div>

                        </div>

                    ))}
                </div>

                <div>
                    <h2>
                        Recent Fraud Alerts
                    </h2>

                    {recentFraud.map(event => (

                        <div
                            key={event.id}
                            style={{
                                border: "1px solid red",
                                padding: "0.75rem",
                                marginBottom: "0.5rem",
                                borderRadius: "8px"
                            }}
                        >
                            <div>
                                {event.reason}
                            </div>

                            <div>
                                Count:
                                {" "}
                                {event.transaction_count}
                            </div>

                        </div>

                    ))}
                </div>
            </div>

        </Layout>
    );
}