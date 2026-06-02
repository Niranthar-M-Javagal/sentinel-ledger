import Layout from "../components/Layout";
import { useActivityFeed }
from "../hooks/useActivityFeed";

export default function Activity() {

    const events =
        useActivityFeed();

    return (
        <Layout>

            <h1>
                Activity Feed
            </h1>

            {events.map(
                (event, index) => (

                    <div
                        key={index}
                        style={{
                            border:
                                "1px solid #333",
                            borderRadius:
                                "8px",
                            padding:
                                "1rem",
                            marginBottom:
                                "0.5rem"
                        }}
                    >

                        <div>
                            <strong>
                                {event.type}
                            </strong>
                        </div>

                        <div>
                            {new Date(
                                event.timestamp
                            ).toLocaleString()}
                        </div>

                        <pre>
                            {
                                JSON.stringify(
                                    event.data,
                                    null,
                                    2
                                )
                            }
                        </pre>

                    </div>

                )
            )}

        </Layout>
    );
}