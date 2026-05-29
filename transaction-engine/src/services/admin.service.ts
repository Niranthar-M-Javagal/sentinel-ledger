import { redis } from "../config/redis";

export async function blacklistAccount(
    accountId: string
) {
    await redis.set(
        `blacklist:${accountId}`,
        "BLOCKED"
    );
}

export async function unblacklistAccount(
    accountId: string
) {
    await redis.del(
        `blacklist:${accountId}`
    );
}

export async function getBlacklistedAccounts() {

    const keys =
        await redis.keys(
            "blacklist:*"
        );

    return keys.map(
        key => key.replace(
            "blacklist:",
            ""
        )
    );
}