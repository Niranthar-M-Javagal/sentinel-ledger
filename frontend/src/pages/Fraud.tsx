import Layout from "../components/Layout";
import FraudFeed from "../components/FraudFeed";
import { useRecentFraud } from "../hooks/useRecentFraud";

export default function Fraud() {
    const { fraudEvents } = useRecentFraud();

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">

                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Fraud Alerts
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        {fraudEvents.length} active event{fraudEvents.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <FraudFeed fraudEvents={fraudEvents} />
            </div>
        </Layout>
    );
}