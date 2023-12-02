"use client";

import { useWS } from "@/context/ws.context";
import { useEffect, useRef } from "react";

export default function WSConnector({ wsURL }: { wsURL: string }) {
    const { connect } = useWS();
    // Prevent connecting multiple times, react 18 strict mode introduced a thing where it calls some hooks twice
    const hasConnected = useRef(false);

    useEffect(() => {
        if (wsURL && !hasConnected.current) {
            connect(wsURL);
            hasConnected.current = true;
        } else if (!wsURL) {
            console.log("no websocket address");
        }
    }, [wsURL, connect]);

    return null;
}
