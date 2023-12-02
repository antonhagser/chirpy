"use client";

import SendIcon from "@/icons/send";
import styles from "./Input.module.css";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/context/chat.context";
import { useAuth } from "@/context/auth.context";
import { sendMessage } from "@/server/conversation";
import clsx from "clsx";

export default function Input({
    selectedConversationId,
    className,
}: {
    selectedConversationId: string;
    className?: string;
}) {
    const { conversations } = useChat();

    const { userId } = useAuth();

    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Whenever the component mounts or the active conversation changes, focus the input
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedConversationId]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const inputText = formData.get("input") as string;

        if (isSending) {
            return;
        }

        setIsSending(true);

        if (!selectedConversationId) {
            console.error("No active conversation is set");
            setIsSending(false);

            return;
        }

        // Prevent sending empty messages
        if (inputText.trim() === "") {
            setIsSending(false);
            return;
        }

        // Get the active conversation
        let activeConversation = conversations.get(selectedConversationId);
        if (!userId || !activeConversation) {
            setIsSending(false);
            console.error("User ID or no active conversation is set");
            return;
        }

        // Try to send message
        try {
            await sendMessage(selectedConversationId, inputText);
        } catch (error) {
            setIsSending(false);
            console.error(error);
            return;
        }

        // Set sending to false
        setIsSending(false);

        // Clear form
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className={clsx(styles.input, className)}>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
                <input
                    className={styles.inputInner}
                    ref={inputRef}
                    type="text"
                    name="input"
                    autoComplete="off"
                />
                <button className={styles.sendButton}>
                    {isSending ? (
                        <span className={styles.spinner}></span>
                    ) : (
                        <SendIcon />
                    )}
                </button>
            </form>
        </div>
    );
}
