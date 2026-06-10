import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Account {
    id: string;
    owner_name: string;
}

interface Transaction {
    id: string;
    amount: number;
    created_at: string;
}

export default function AccountDetails() {
    const { id }       = useParams();
    const navigate     = useNavigate();

    const [account,      setAccount]      = useState<Account | null>(null);
    const [balance,      setBalance]      = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function load() {
            const [accountRes, balanceRes, txRes] = await Promise.all([
                fetch(`http://localhost:3000/accounts/${id}`),
                fetch(`http://localhost:3000/accounts/${id}/balance`),
                fetch(`http://localhost:3000/accounts/${id}/transactions`),
            ]);

            const [accountData, balanceData, txData] = await Promise.all([
                accountRes.json(),
                balanceRes.json(),
                txRes.json(),
            ]);

            setAccount(accountData);
            setBalance(balanceData.balance);
            setTransactions(txData);
        }

        load();
    }, [id]);

    if (!account) {
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
            <div className="max-w-4xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate("/accounts")}
                    className="flex items-center gap-2 text-sm mb-8 transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                    ← Back to Accounts
                </button>

                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1
                            className="text-2xl font-bold tracking-tight"
                            style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                        >
                            {account.owner_name}
                        </h1>
                        <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                            {account.id}
                        </p>
                    </div>

                    <div
                        className="rounded-xl px-5 py-3 text-right"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                            style={{ color: "var(--text-secondary)" }}>
                            Balance
                        </p>
                        <p className="text-2xl font-bold tabular-nums"
                            style={{ color: "var(--text)", letterSpacing: "-0.03em" }}>
                            ₹{balance.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                {/* Transactions table */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <h2 className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--text-secondary)" }}>
                            Transactions
                        </h2>
                    </div>

                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                                {["ID", "Amount", "Date"].map(h => (
                                    <th key={h}
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                                        style={{ color: "var(--text-muted)" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, i) => (
                                <tr
                                    key={tx.id}
                                    style={{
                                        borderBottom: i < transactions.length - 1
                                            ? "1px solid var(--border-subtle)" : "none",
                                    }}
                                >
                                    <td className="px-6 py-3 text-xs font-mono"
                                        style={{ color: "var(--text-muted)" }}>
                                        {tx.id}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-semibold tabular-nums"
                                        style={{ color: "var(--text)" }}>
                                        ₹{tx.amount.toLocaleString("en-IN")}
                                    </td>
                                    <td className="px-6 py-3 text-xs"
                                        style={{ color: "var(--text-secondary)" }}>
                                        {new Date(tx.created_at).toLocaleString(undefined, {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </Layout>
    );
}