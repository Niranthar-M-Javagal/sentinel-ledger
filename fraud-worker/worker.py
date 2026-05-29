import asyncio
import time
import psycopg2
import uuid
from redis.asyncio import Redis

pg_conn = psycopg2.connect(
    host="localhost",
    database="sentinel_ledger",
    user="postgres",
    password="postgres123",
    port=5432
)

pg_conn.autocommit = True

redis = Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

STREAM_NAME = "transactions-stream"

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

        print("\n🚨 ACCOUNT BLACKLISTED 🚨")
        print(from_account)


async def consume_transactions():

    # Only consume NEW events
    last_id = "$"

    print("Fraud Worker Started")

    while True:

        response = await redis.xread(
            {STREAM_NAME: last_id},
            block=0
        )

        for stream, messages in response:

            for message_id, data in messages:

                print("\n=== EVENT RECEIVED ===")
                print("Message ID:", message_id)

                await process_transaction(
                    data
                )

                last_id = message_id


asyncio.run(
    consume_transactions()
)