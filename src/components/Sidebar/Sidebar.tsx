"use client";

import { useChat } from "@/context/chat.context";
import ConversationsList from "./Conversations/List";
import NewConversation from "./NewConversation/NewConversation";
import styles from "./Sidebar.module.css";

import clsx from "clsx";

interface Props {
    className?: string;
}

export default function Sidebar({ className }: Props) {
    const { conversations, selectedConversationId } = useChat();

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
