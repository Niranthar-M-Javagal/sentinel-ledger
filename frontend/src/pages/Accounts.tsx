import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Account {
    id: string;
    owner_name: string;
    balance: number;
    transaction_count: number;
    is_blacklisted: boolean;
}

export default function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/accounts/stats")
            .then(res => res.json())
            .then(setAccounts);
    }, []);

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Accounts
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        {accounts.length} accounts total
                    </p>
                </div>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                                {["Name", "Balance", "Transactions", "Status"].map(h => (
                                    <th key={h}
                                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                                        style={{ color: "var(--text-muted)" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account, i) => (
                                <tr
                                    key={account.id}
                                    onClick={() => navigate(`/accounts/${account.id}`)}
                                    className="cursor-pointer transition-colors"
                                    style={{ borderBottom: i < accounts.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <td className="px-6 py-3.5 text-sm font-medium"
                                        style={{ color: "var(--text)" }}>
                                        {account.owner_name}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm tabular-nums"
                                        style={{ color: "var(--text)" }}>
                                        ₹{account.balance.toLocaleString("en-IN")}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm tabular-nums"
                                        style={{ color: "var(--text-secondary)" }}>
                                        {account.transaction_count.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                            style={account.is_blacklisted
                                                ? { background: "rgba(248,113,113,0.12)", color: "var(--danger)" }
                                                : { background: "rgba(74,222,128,0.10)",  color: "var(--success)" }
                                            }
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ background: account.is_blacklisted ? "var(--danger)" : "var(--success)" }}
                                            />
                                            {account.is_blacklisted ? "Blacklisted" : "Active"}
                                        </span>
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