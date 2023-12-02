"use client";

import { redirect } from "next/navigation";
import { isUUID } from "@/utils";

import styles from "./page.module.css";
import MessageHolder from "@/components/MessageHolder/MessageHolder";
import Input from "@/components/Input/Input";
import { useEffect } from "react";
import { useChat } from "@/context/chat.context";

const validateConversationId = (conversationId: string) => {
    if (!isUUID(conversationId)) {
        redirect("/app");
    }
};

export default function Conversation({
    params,
}: {
    params: {
        conversationId: string;
    };
}) {
    const { setSelectedConversationId } = useChat();

    // Get and validate the conversation ID
    const conversationId = params.conversationId;
    validateConversationId(conversationId);

    useEffect(() => {
        setSelectedConversationId(conversationId);
    }, [conversationId, setSelectedConversationId]);

    return (
        <div className={styles.conversation}>
            <MessageHolder selectedConversationId={params.conversationId} />
            <Input
                selectedConversationId={params.conversationId}
                className={styles.input}
            />
        </div>
    );
}
