import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000"
});

export async function getBlacklistedAccounts() {
    const response =
        await api.get("/admin/blacklist");

    return response.data;
}

export async function unblacklistAccount(
    accountId: string
) {
    await api.post(
        "/admin/unblacklist",
        {
            accountId
        }
    );
}

export async function getAccounts() {

    const response =
        await api.get("/accounts");

    return response.data;
}

export async function fundAccount(
    accountId: string,
    amount: number
) {

    const response =
        await api.post(
            "/admin/fund-account",
            {
                accountId,
                amount
            }
        );

    return response.data;
}

export async function getOperationsMetrics() {
    const response =
        await api.get("/operations/metrics");

    return response.data;
}