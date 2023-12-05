"use client";

import clsx from "clsx";
import Twemoji from "react-emoji-render";
import { MessageData } from "@/models/conversation";

import styles from "./Message.module.css";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth.context";

interface Props {
    self: MessageData;
    isIncoming: boolean;
    nrInGroup?: number;
}

function isOnlyEmojis(str: string) {
    const onlyEmojis = str.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
    return str === onlyEmojis;
}

export default function Message({ self, isIncoming, nrInGroup }: Props) {
    const [isEmojiOnly, setIsEmojiOnly] = useState(false);
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        // Don't render the message background if it's an emoji only message
        if (
            messageRef.current &&
            messageRef.current.childNodes[0] &&
            messageRef.current.childNodes[0].textContent
        ) {
            let x = messageRef.current.childNodes[0].textContent;
            if ([...x].length > 1) return;

            let isEmojiOnly = isOnlyEmojis(x ?? "");
            setIsEmojiOnly(isEmojiOnly);
        }
    }, [self.content]);

    return (
        <div
            className={clsx(styles.message, {
                [styles.incoming]: isIncoming,
                [styles.outgoing]: !isIncoming,
                [styles.withOnlyEmoji]: isEmojiOnly,
                [styles.firstInGroup]: (nrInGroup ?? 0) === 0,
            })}
        >
            <p ref={messageRef}>
                {self.content ? (
                    <Twemoji
                        text={self.content}
                        onlyEmojiClassName={styles.onlyEmoji}
                    />
                ) : null}
            </p>
        </div>
    );
}

interface AuthorMessagesProps {
    username: string;
    messages: MessageData[];
    isGroupIncoming: boolean;
}

export const AuthorMessages: React.FC<AuthorMessagesProps> = ({
    username,
    messages,
    isGroupIncoming,
}) => {
    const { userId } = useAuth();

    return (
        <div
            className={clsx(styles.group, {
                [styles.groupIncoming]: isGroupIncoming,
            })}
        >
            <div
                className={clsx(styles.author, {
                    [styles.authorIncoming]: isGroupIncoming,
                })}
            >
                <p>{username}</p>
            </div>
            <div className={styles.groupedMessages}>
                {messages.map((message, index) => (
                    <Message
                        key={message.id}
                        self={message}
                        isIncoming={message.userId !== userId}
                        nrInGroup={index}
                    />
                ))}
            </div>
        </div>
    );
};
