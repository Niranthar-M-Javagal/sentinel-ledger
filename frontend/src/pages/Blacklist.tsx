import Layout from "../components/Layout";
import { useBlacklist } from "../hooks/useBlacklist";
import { unblacklistAccount } from "../services/api";

export default function Blacklist() {
    const { accounts, reload } = useBlacklist();

    async function handleUnblacklist(accountId: string) {
        await unblacklistAccount(accountId);
        reload();
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Blacklist
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        {accounts.length} blocked account{accounts.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                                {["Account ID", "Blacklisted At", ""].map((h, i) => (
                                    <th key={i}
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
                                    key={account.account_id}
                                    style={{
                                        borderBottom: i < accounts.length - 1
                                            ? "1px solid var(--border-subtle)" : "none",
                                    }}
                                >
                                    <td className="px-6 py-3.5 text-xs font-mono"
                                        style={{ color: "var(--text-secondary)" }}>
                                        {account.account_id}
                                    </td>
                                    <td className="px-6 py-3.5 text-xs"
                                        style={{ color: "var(--text-secondary)" }}>
                                        {new Date(account.blacklisted_at).toLocaleString(undefined, {
                                            month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button
                                            onClick={() => handleUnblacklist(account.account_id)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                                            style={{
                                                background: "rgba(74,222,128,0.08)",
                                                color:      "var(--success)",
                                                border:     "1px solid rgba(74,222,128,0.2)",
                                            }}
                                            onMouseEnter={e => {
                                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.15)";
                                            }}
                                            onMouseLeave={e => {
                                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.08)";
                                            }}
                                        >
                                            Unblacklist
                                        </button>
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