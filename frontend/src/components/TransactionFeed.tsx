import type { TransactionEvent } from "../types/events";

interface Props {
    transactions: TransactionEvent[];
}

export default function TransactionFeed({
    transactions
}: Props) {

    return (
        <div>
            <h2>Recent Transactions</h2>

            {transactions.map(tx => (
                <div
                    key={tx.transactionId}
                    style={{
                        border: "1px solid #333",
                        padding: "1rem",
                        marginBottom: "0.5rem",
                        borderRadius: "8px"
                    }}
                >
                    <div>
                        Amount: ₹{tx.amount}
                    </div>

                    <div>
                        {tx.fromAccount}
                    </div>

                    <div>
                        →
                    </div>

                    <div>
                        {tx.toAccount}
                    </div>
                </div>
            ))}
        </div>
    );
}