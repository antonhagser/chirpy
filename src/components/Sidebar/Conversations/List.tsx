"use client";

import styles from "./List.module.css";
import clsx from "clsx";
import Conversation from "./Conversation";

export interface ConversationState {
    id: string;
    name: string;
    avatarURL: string;
    presence: "online" | "offline" | "idle";
    message: string;
    unreadCount?: number;
}

interface Props {
    className?: string;
    conversations: Map<string, ConversationState>;
    selectedConversationId?: string;
}

export default function ConversationsList({
    className,
    conversations,
    selectedConversationId,
}: Props) {
    return (
        <div className={clsx(styles.conversations, className)}>
            <ul className={styles.conversationsHolder}>
                {Array.from(conversations.values()).map((conversation) => (
                    <Conversation
                        key={conversation.id}
                        id={conversation.id}
                        selected={selectedConversationId == conversation.id}
                        avatarURL={conversation.avatarURL}
                        presence={conversation.presence}
                        name={conversation.name}
                        message={conversation.message}
                        unreadCount={conversation.unreadCount}
                    />
                ))}
            </ul>
        </div>
    );
}
