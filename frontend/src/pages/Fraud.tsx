import Layout from "../components/Layout";
import FraudFeed from "../components/FraudFeed";

import {
    useRecentFraud
} from "../hooks/useRecentFraud";

export default function Fraud() {

    const {
        fraudEvents
    } = useRecentFraud();

    return (
        <Layout>

            <h1>
                Fraud Alerts
            </h1>

            <FraudFeed
                fraudEvents={fraudEvents}
            />

        </Layout>
    );
}