"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import styles from "./MessageHolder.module.css";

import { useAuth } from "@/context/auth.context";
import { useChat } from "@/context/chat.context";
import { MessageData } from "@/models/conversation";
import { paginateMessages } from "@/server/conversation";
import { AuthorMessages } from "../Message/Message";

interface Props {
    className?: string;
    selectedConversationId: string;
}

export default function MessageHolder({
    className,
    selectedConversationId,
}: Props) {
    const { messages, addMessages, hasMore, setHasMore } = useChat();
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

    const [isLoading, setIsLoading] = useState(false);
    const loadMoreMessages = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            await loadMore();
        } catch (_) {
            console.error("Failed to load more messages");
        }

        setIsLoading(false);
    }, [isLoading, loadMore]);

    useEffect(() => {
        loadMore();
    }, [loadMore]);

    return (
        <div className={clsx(styles.holder, className)} id="scrollableDiv">
            <InfiniteScroll
                dataLength={messages.get(selectedConversationId)?.length ?? 0}
                className={styles.holderScroller}
                next={loadMoreMessages}
                hasMore={hasMore.get(selectedConversationId) ?? false}
                loader={<h4>Loading...</h4>}
                scrollableTarget={"scrollableDiv"}
                endMessage={<></>}
            >
                {groupMessagesByAuthor(
                    messages.get(selectedConversationId) ?? []
                ).map((group, index) => (
                    <AuthorMessages
                        key={index}
                        username={group[0].username}
                        messages={group}
                        isGroupIncoming={group[0].userId !== userId}
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
}

/**
 * Groups messages by author
 */
function groupMessagesByAuthor(messages: MessageData[]): MessageData[][] {
    const groupedMessages: MessageData[][] = [];

    messages.forEach((message) => {
        if (
            groupedMessages.length > 0 &&
            groupedMessages[groupedMessages.length - 1][0].userId ===
                message.userId
        ) {
            // Add the message to the last group, preserving the original order
            groupedMessages[groupedMessages.length - 1].push(message);
        } else {
            // Start a new group with the current message
            groupedMessages.push([message]);
        }
    });

    return groupedMessages;
}
