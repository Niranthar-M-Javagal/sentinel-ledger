import { Router } from "express";
import { pool } from "../config/database";
import {redis} from "../config/redis";

const router = Router();

router.get("/", async (_, res) => {
  let postgres = false;
  let redisHealthy = false;

  try {
    await pool.query("SELECT 1");
    postgres = true;
  } catch {}

  try {
    await redis.ping();
    redisHealthy = true;
  } catch {}

  res.json({
    postgres,
    redis: redisHealthy,
    timestamp: new Date().toISOString()
  });
});

export default router;