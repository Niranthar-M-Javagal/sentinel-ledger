import type { FraudEvent } from "../types/fraud";

interface Props {
    fraudEvents: FraudEvent[];
}

export default function FraudFeed({
    fraudEvents
}: Props) {

    return (
        <div>
            <h2>Fraud Events</h2>

            {fraudEvents.map(event => (

                <div
                    key={event.id}
                    style={{
                        border: "1px solid red",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "0.5rem"
                    }}
                >
                    <div>
                        Account:
                    </div>

                    <div>
                        {event.account_id}
                    </div>

                    <div>
                        Transactions:
                        {" "}
                        {event.transaction_count}
                    </div>

                    <div>
                        Reason:
                        {" "}
                        {event.reason}
                    </div>

                    <div>
                        {new Date(
                            event.created_at
                        ).toLocaleString()}
                    </div>

                </div>
            ))}
        </div>
    );
}