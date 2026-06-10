import asyncio
import time
import psycopg2
import uuid
from redis.asyncio import Redis
import json

pg_conn = psycopg2.connect(
    host="postgres",
    database="sentinel_ledger",
    user="postgres",
    password="postgres123",
    port=5432
)

pg_conn.autocommit = True

redis = Redis(
    host="redis",
    port=6379,
    decode_responses=True,
    socket_timeout=None
)

STREAM_NAME = "transactions-stream"
GROUP_NAME = "fraud-group"
CONSUMER_NAME = "worker-1"

WINDOW_SECONDS = 10
MAX_TRANSACTIONS = 5


def save_fraud_event(
    account_id,
    transaction_count
):
    cursor = pg_conn.cursor()

    cursor.execute(
        """
        INSERT INTO fraud_events (
            id,
            account_id,
            transaction_count,
            reason
        )
        VALUES (
            %s,
            %s,
            %s,
            %s
        )
        """,
        (
            str(uuid.uuid4()),
            account_id,
            transaction_count,
            "Velocity threshold exceeded"
        )
    )

    cursor.close()


async def process_transaction(data):

    from_account = data["fromAccount"]
    transaction_id = data["transactionId"]

    timestamp = int(time.time())

    zset_key = f"velocity:{from_account}"

    await redis.zadd(
        zset_key,
        {
            transaction_id: timestamp
        }
    )

    cutoff = timestamp - WINDOW_SECONDS

    await redis.zremrangebyscore(
        zset_key,
        0,
        cutoff
    )

    count = await redis.zcard(
        zset_key
    )

    print("\n=== FRAUD CHECK ===")
    print("Account:", from_account)
    print("Transactions in window:", count)

    blacklist_key = (
        f"blacklist:{from_account}"
    )

    already_blacklisted = await redis.exists(
        blacklist_key
    )

    if (
        count > MAX_TRANSACTIONS
        and not already_blacklisted
    ):

        save_fraud_event(
            from_account,
            count
        )

        await redis.set(
            blacklist_key,
            "BLOCKED"
        )

        await redis.publish(
            "fraud-alerts",
            json.dumps({
                "account_id": from_account,
                "transaction_count": count,
                "reason": "Velocity threshold exceeded",
                "created_at": time.time()
            })
        )

        print("\n🚨 ACCOUNT BLACKLISTED 🚨")
        print(from_account)


async def consume_transactions():

    print("Fraud Worker Started")
    print(
        f"Consumer Group: {GROUP_NAME}"
    )
    print(
        f"Consumer: {CONSUMER_NAME}"
    )

    while True:

        try:

            await redis.set(
                "worker:heartbeat",
                int(time.time()),
                ex=30
            )

            response = await redis.xreadgroup(
                groupname=GROUP_NAME,
                consumername=CONSUMER_NAME,
                streams={
                    STREAM_NAME: ">"
                },
                count=10,
                block=5000
            )

            if not response:
                continue

            for stream, messages in response:

                for message_id, data in messages:

                    print(
                        "\n=== EVENT RECEIVED ==="
                    )
                    print(
                        "Message ID:",
                        message_id
                    )

                    await process_transaction(
                        data
                    )

                    await redis.xack(
                        STREAM_NAME,
                        GROUP_NAME,
                        message_id
                    )

                    print(
                        f"ACKED: {message_id}"
                    )

        except Exception as e:

            print(
                f"Worker Error: {e}"
            )

            await asyncio.sleep(2)


asyncio.run(
    consume_transactions()
)