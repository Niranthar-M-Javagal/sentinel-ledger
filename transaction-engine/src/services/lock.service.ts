import { redis } from "../config/redis";

export async function acquireLock(
  accountId: string
): Promise<boolean> {
  const key = `lock:${accountId}`;

  const result = await redis.set(
    key,
    "LOCKED",
    {
      NX: true,
      EX: 10,
    }
  );

  return result === "OK";
}

export async function releaseLock(
  accountId: string
): Promise<void> {
  const key = `lock:${accountId}`;

  await redis.del(key);
}