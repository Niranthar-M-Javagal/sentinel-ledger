import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export default function Layout({
    children
}: Props) {
    return (
        <div>

            <nav
                style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    borderBottom:
                        "1px solid #333"
                }}
            >
                <Link to="/">
                    Dashboard
                </Link>

                <Link to="/transactions">
                    Transactions
                </Link>

                <Link to="/fraud">
                    Fraud
                </Link>

                <Link to="/accounts">
                    Accounts
                </Link>

                <Link to="/blacklist">
                    Blacklist
                </Link>

                <Link to="/activity">
                    Activity
                </Link>
            </nav>

            <main
                style={{
                    padding: "2rem"
                }}
            >
                {children}
            </main>

        </div>
    );
}