import { redis } from "../config/redis";

export async function publishTransactionEvent(
  transactionId: string,
  fromAccount: string,
  toAccount: string,
  amount: number
): Promise<void> {

  await redis.xAdd(
    "transactions-stream",
    "*",
    {
      transactionId,
      fromAccount,
      toAccount,
      amount: amount.toString(),
      timestamp: Date.now().toString()
    }
  );

}