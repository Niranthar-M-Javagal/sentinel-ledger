import Layout from "../components/Layout";
import TransactionFeed from "../components/TransactionFeed";
import { useRecentTransactions } from "../hooks/useRecentTransactions";

export default function Transactions() {
    const { transactions } = useRecentTransactions();

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">

                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Transactions
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        {transactions.length} recent transaction{transactions.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <TransactionFeed transactions={transactions} />
            </div>
        </Layout>
    );
}