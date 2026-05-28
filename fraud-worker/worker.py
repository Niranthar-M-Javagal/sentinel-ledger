import asyncio
import time

from redis.asyncio import Redis

redis = Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

STREAM_NAME = "transactions-stream"

WINDOW_SECONDS = 10

MAX_TRANSACTIONS = 5


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

    if count > MAX_TRANSACTIONS:

        blacklist_key = (
            f"blacklist:{from_account}"
        )

        await redis.set(
            blacklist_key,
            "BLOCKED"
        )

        print("\n🚨 ACCOUNT BLACKLISTED 🚨")
        print(from_account)


async def consume_transactions():

    last_id = "0"

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