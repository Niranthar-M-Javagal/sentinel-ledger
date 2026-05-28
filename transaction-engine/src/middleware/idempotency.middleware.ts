import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export async function idempotency(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("=== MIDDLEWARE HIT ===");

  try {
    const key = req.header("X-Idempotency-Key");

    console.log("Header:", key);

    if (!key) {
      res.status(400).json({
        error: "Missing X-Idempotency-Key",
      });
      return;
    }

    const redisKey = `idem:${key}`;

    console.log("Checking:", redisKey);

    const existing = await redis.get(redisKey);

    console.log("Existing:", existing);

    if (existing !== null) {
      res.status(409).json({
        error: "Duplicate Request",
      });
      return;
    }

    console.log("Writing to Redis...");

    await redis.set(redisKey, "STARTED");

    const verify = await redis.get(redisKey);

    console.log("Stored Value:", verify);

    next();
  } catch (error) {
    console.error("Middleware Error:", error);

    res.status(500).json({
      error: "middleware_failed",
    });
  }
}