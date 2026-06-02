import Layout from "../components/Layout";
import TransactionFeed from "../components/TransactionFeed";

import {
    useRecentTransactions
} from "../hooks/useRecentTransactions";

export default function Transactions() {

    const {
        transactions,
        addTransaction
    } = useRecentTransactions();

    return (
        <Layout>

            <h1>
                Transactions
            </h1>

            <TransactionFeed
                transactions={transactions}
            />

        </Layout>
    );
}