import { useEffect }
from "react";

import { socket }
from "../services/socket";

export function useBlacklistSocket(
    onUpdate: () => void
) {

    useEffect(() => {

        socket.on(
            "blacklist_updated",
            onUpdate
        );

        return () => {

            socket.off(
                "blacklist_updated",
                onUpdate
            );
        };

    }, [onUpdate]);
}