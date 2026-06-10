import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
    BarChart3,
    Wallet,
    ShieldAlert,
    Users,
    Activity,
    Ban,
    Landmark,
    Server
} from "lucide-react";

interface Props {
    children: ReactNode;
}

const links = [
    { to: "/",             label: "Dashboard",    icon: BarChart3   },
    { to: "/transactions", label: "Transactions", icon: Wallet      },
    { to: "/fraud",        label: "Fraud",        icon: ShieldAlert },
    { to: "/accounts",     label: "Accounts",     icon: Users       },
    { to: "/blacklist",    label: "Blacklist",     icon: Ban         },
    { to: "/activity",     label: "Activity",     icon: Activity    },
    { to: "/treasury",     label: "Treasury",     icon: Landmark    },
    { to: "/operations",   label: "Operations",   icon: Server      },
];

export default function Layout({ children }: Props) {
    return (
        <div className="flex min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

            <aside
                className="w-64 flex flex-col flex-shrink-0"
                style={{ background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}
            >
                {/* Brand */}
                <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <div className="flex items-center gap-2.5">
                        {/* Violet accent dot */}
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: "var(--accent)" }}
                        />
                        <h1
                            className="text-base font-semibold tracking-tight"
                            style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
                        >
                            SentinelLedger
                        </h1>
                    </div>
                    <p
                        className="text-xs mt-1.5 ml-[18px]"
                        style={{ color: "var(--text-muted)", letterSpacing: "0.04em" }}
                    >
                        Fintech Platform
                    </p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                            style={({ isActive }) =>
                                isActive
                                    ? {
                                        background:  "var(--accent-dim)",
                                        color:       "var(--accent-text)",
                                        borderLeft:  "2px solid var(--accent)",
                                        paddingLeft: "10px", // compensate for border
                                    }
                                    : {
                                        color:      "var(--text-secondary)",
                                        background: "transparent",
                                        borderLeft: "2px solid transparent",
                                        paddingLeft: "10px",
                                    }
                            }
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                if (!el.dataset.active) {
                                    el.style.background = "var(--surface-hover)";
                                    el.style.color = "var(--text)";
                                }
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                if (!el.dataset.active) {
                                    el.style.background = "transparent";
                                    el.style.color = "var(--text-secondary)";
                                }
                            }}
                        >
                            <Icon size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div
                    className="px-6 py-4 text-xs"
                    style={{
                        borderTop: "1px solid var(--border-subtle)",
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                    }}
                >
                    v2.4.1 · production
                </div>

            </aside>

            {/* Main content */}
            <main
                className="flex-1 overflow-auto"
                style={{ padding: "2rem 2.5rem" }}
            >
                {children}
            </main>

        </div>
    );
}