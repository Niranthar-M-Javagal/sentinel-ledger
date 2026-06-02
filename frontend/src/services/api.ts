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