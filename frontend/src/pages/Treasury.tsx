import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getAccounts, fundAccount } from "../services/api";

interface Account {
    id: string;
    owner_name: string;
}

const PRESET_AMOUNTS = [1_000, 5_000, 10_000, 50_000];

export default function Treasury() {
    const [accounts,   setAccounts]   = useState<Account[]>([]);
    const [accountId,  setAccountId]  = useState("");
    const [amount,     setAmount]     = useState(1000);
    const [loading,    setLoading]    = useState(false);
    const [status,     setStatus]     = useState<"idle" | "success" | "error">("idle");

    useEffect(() => { loadAccounts(); }, []);

    async function loadAccounts() {
        const data = await getAccounts();
        const filtered = data.filter((a: Account) => a.owner_name !== "SYSTEM");
        setAccounts(filtered);
        if (filtered.length > 0) setAccountId(filtered[0].id);
    }

    async function handleFund() {
        try {
            setLoading(true);
            setStatus("idle");
            await fundAccount(accountId, amount);
            setStatus("success");
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="max-w-xl mx-auto">

                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--text)", letterSpacing: "-0.025em" }}
                    >
                        Treasury
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-muted)" }}>
                        Fund accounts directly
                    </p>
                </div>

                <div
                    className="rounded-2xl p-6 space-y-6"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    {/* Account selector */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--text-secondary)" }}>
                            Account
                        </label>
                        <select
                            value={accountId}
                            onChange={e => setAccountId(e.target.value)}
                            className="w-full text-sm rounded-xl px-4 py-2.5 appearance-none transition-colors"
                            style={{
                                background:  "var(--surface-hover)",
                                border:      "1px solid var(--border)",
                                color:       "var(--text)",
                                outline:     "none",
                            }}
                        >
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}
                                    style={{ background: "var(--surface)" }}>
                                    {account.owner_name} — {account.id}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--text-secondary)" }}>
                            Amount
                        </label>

                        {/* Presets */}
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            {PRESET_AMOUNTS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setAmount(p)}
                                    className="text-xs font-medium py-1.5 rounded-lg transition-all"
                                    style={amount === p
                                        ? { background: "var(--accent-dim)", color: "var(--accent-text)", border: "1px solid var(--accent)" }
                                        : { background: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                                    }
                                >
                                    ₹{p.toLocaleString("en-IN")}
                                </button>
                            ))}
                        </div>

                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full text-sm rounded-xl px-4 py-2.5 tabular-nums transition-colors"
                            style={{
                                background: "var(--surface-hover)",
                                border:     "1px solid var(--border)",
                                color:      "var(--text)",
                                outline:    "none",
                            }}
                        />
                    </div>

                    {/* Status */}
                    {status !== "idle" && (
                        <div
                            className="text-xs font-medium px-4 py-2.5 rounded-xl"
                            style={status === "success"
                                ? { background: "rgba(74,222,128,0.08)",  color: "var(--success)", border: "1px solid rgba(74,222,128,0.2)"  }
                                : { background: "rgba(248,113,113,0.08)", color: "var(--danger)",  border: "1px solid rgba(248,113,113,0.2)" }
                            }
                        >
                            {status === "success" ? "✓ Funding successful" : "✗ Funding failed — please try again"}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleFund}
                        disabled={loading}
                        className="w-full py-2.5 text-sm font-semibold rounded-xl transition-all"
                        style={{
                            background: loading ? "var(--accent-dim)" : "var(--accent)",
                            color:      loading ? "var(--accent-text)" : "#fff",
                            border:     "none",
                            opacity:    loading ? 0.7 : 1,
                            cursor:     loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Funding…" : `Fund ₹${amount.toLocaleString("en-IN")}`}
                    </button>
                </div>
            </div>
        </Layout>
    );
}