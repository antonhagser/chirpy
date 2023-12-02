"use client";

import clsx from "clsx";
import styles from "./Sidebar.module.css";
import NewConversation from "./NewConversation/NewConversation";
import ConversationsList from "./Conversations/List";
import { useChat } from "@/context/chat.context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
    className?: string;
}

export default function Sidebar({ className }: Props) {
    const { conversations, selectedConversationId } = useChat();

    const router = useRouter();

    useEffect(() => {
        if (selectedConversationId) {
            const conversation = conversations.get(selectedConversationId);
            if (conversation) {
                document.title = `Chirpy | ${conversation.name}`;
            } else {
                router.replace("/app");
            }
        }
    });

    return (
        <aside className={clsx(className, styles.sidebar)}>
            <NewConversation />
            <ConversationsList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
            />
        </aside>
    );
}
