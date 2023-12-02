"use client";

import clsx from "clsx";

import styles from "./MessageHolder.module.css";

import { useChat } from "@/context/chat.context";
import { paginateMessages } from "@/server/conversation";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "../Message/Message";
import { useAuth } from "@/context/auth.context";

interface Props {
    className?: string;
    selectedConversationId: string;
}

export default function MessageHolder({
    className,
    selectedConversationId,
}: Props) {
    const {
        messages,
        addMessages,
        hasMore,
        setHasMore,
        setSelectedConversationId,
    } = useChat();
    const { userId } = useAuth();

    const loadMore = useCallback(async () => {
        let hasMoreToFetch = hasMore.get(selectedConversationId) ?? true;
        if (hasMoreToFetch) {
            let allMessages = messages.get(selectedConversationId);
            if (!allMessages) {
                console.error("No messages for conversation? PANIC!");
                return;
            }

            const mostNewlyFetched = allMessages[allMessages.length - 1];

            let createdAt = mostNewlyFetched?.createdAt
                ? mostNewlyFetched.createdAt
                : null;

            const response = await paginateMessages(
                selectedConversationId,
                20,
                createdAt
            );

            setHasMore(selectedConversationId, response.hasMore);
            addMessages(response.messages);
        }
    }, [setHasMore, hasMore, messages, addMessages, selectedConversationId]);

    useEffect(() => {
        loadMore();
    }, [loadMore]);

    return (
        <div className={clsx(styles.holder, className)} id="scrollableDiv">
            <InfiniteScroll
                dataLength={messages.get(selectedConversationId)?.length ?? 0}
                className={styles.holderScroller}
                next={loadMore}
                hasMore={hasMore.get(selectedConversationId) ?? false}
                loader={<h4>Loading...</h4>}
                scrollableTarget={"scrollableDiv"}
                endMessage={<></>}
            >
                {messages
                    .get(selectedConversationId)
                    ?.map((message) => (
                        <Message
                            key={message.id}
                            self={message}
                            isIncoming={message.userId !== userId}
                        />
                    ))}
            </InfiniteScroll>
        </div>
    );
}
