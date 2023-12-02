"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { HandleIncomingWSMessage } from "./websocket/handle";
import { useChat } from "./chat.context";

interface WSContextType {
    ws: React.MutableRefObject<WebSocket | null>;
    isConnecting: boolean;
    connect: (address: string) => void;
}

const WSContext = createContext<WSContextType | null>(null);

export function WSProvider({ children }: { children: React.ReactNode }) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const chat = useChat();

    const connect = useCallback(
        async (wsAddress: string) => {
            console.log("connecting to websocket");

            if (ws && ws.current?.readyState === WebSocket.OPEN) {
                console.log("WebSocket is already connected");
                return;
            }

            if (wsAddress) {
                setIsConnecting(true);
                const newWs = new WebSocket(wsAddress);
                newWs.onopen = () => {
                    setIsConnecting(false);
                    console.log("websocket connected");
                };
                newWs.onmessage = (event) => {
                    let incomingMessage = JSON.parse(event.data);
                    HandleIncomingWSMessage(incomingMessage, chat);
                };
                newWs.onclose = () => {
                    ws.current = null;
                    setIsConnecting(false);
                };
                ws.current = newWs;
            }
        },
        [chat]
    );

    const providerValue = useMemo(
        () => ({
            ws,
            isConnecting,
            connect,
        }),
        [ws, isConnecting, connect]
    );

    return (
        <WSContext.Provider value={providerValue}>
            {children}
        </WSContext.Provider>
    );
}

export function useWS(): WSContextType {
    const context = useContext(WSContext);
    if (!context) {
        // This error is for developers' benefit in development mode
        throw new Error("useWS must be used within an WSProvider");
    }
    return context;
}
