import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export async function blacklistCheck(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  try {

    const fromAccount =
      req.body.fromAccount;

    if (!fromAccount) {
      next();
      return;
    }

    const blacklistKey =
      `blacklist:${fromAccount}`;

    const blocked =
      await redis.get(
        blacklistKey
      );

    if (blocked) {

      res.status(403).json({

        error:
        "Account Blacklisted"

      });

      return;

    }

    next();

  } catch (err) {

    console.log(
      "Blacklist Middleware Error:",
      err
    );

    res.status(500).json({

      error:
      "blacklist_check_failed"

    });

  }

}