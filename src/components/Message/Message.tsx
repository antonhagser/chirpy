"use client";

import clsx from "clsx";
import Twemoji from "react-emoji-render";
import { MessageData } from "@/models/conversation";

import styles from "./Message.module.css";
import { useEffect, useRef, useState } from "react";

interface Props {
    self: MessageData;
    isIncoming: boolean;
}

function isOnlyEmojis(str: string) {
    const onlyEmojis = str.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
    return str === onlyEmojis;
}

export default function Message({ self, isIncoming }: Props) {
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
                [styles.messageWithOnlyEmoji]: isEmojiOnly,
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
