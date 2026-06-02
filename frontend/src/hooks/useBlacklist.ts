import { useEffect, useState } from "react";

import {
    getBlacklistedAccounts
} from "../services/api";

import type {
    BlacklistedAccount
} from "../types/blacklist";

export function useBlacklist() {

    const [accounts, setAccounts] =
        useState<BlacklistedAccount[]>([]);

    async function load() {

        const data =
            await getBlacklistedAccounts();

        setAccounts(data);
    }

    useEffect(() => {
        load();
    }, []);

    return {
        accounts,
        reload: load
    };
}