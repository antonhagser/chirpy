"use client";

import { useChat } from "@/context/chat.context";
import { useEffect } from "react";

export default function ConversationUpdater({
    conversationId,
}: {
    conversationId: string;
}) {
    const { setSelectedConversationId } = useChat();

    useEffect(() => {
        setSelectedConversationId(conversationId);

        return () => {
            setSelectedConversationId(undefined);
        };
    }, [conversationId, setSelectedConversationId]);

    return <></>;
}
