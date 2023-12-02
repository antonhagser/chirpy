"use client";

import { ConversationState } from "@/components/Sidebar/Conversations/List";
import { MessageData } from "@/models/conversation";
import { useParams } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAuth } from "./auth.context";

export interface ChatContextInit {
    conversations: Map<string, ConversationState>;
    hasMore: Map<string, boolean>;
    messages: Map<string, MessageData[]>;
}

export interface ChatContextType {
    conversations: Map<string, ConversationState>;
    addConversation: (conversation: ConversationState) => void;

    selectedConversationId?: string;
    setSelectedConversationId: (id?: string) => void;

    // Message map is keyed by conversation ID
    messages: Map<string, MessageData[]>;
    addMessage: (message: MessageData) => void;
    addMessages: (messages: MessageData[]) => void;
    addMessageToFront: (message: MessageData) => void;

    // hasMore map is keyed by conversation ID
    hasMore: Map<string, boolean>;
    setHasMore: (id: string, hasMore: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
    children,
    init,
}: {
    children: React.ReactNode;
    init: ChatContextInit;
}) {
    // Update URL based on selected conversation
    const params = useParams();
    const conversationId = useMemo(() => params.conversationId, [params]);

    const { userId } = useAuth();

    const [selectedConversationId, setSelectedConversationId] = useState<
        string | undefined
    >(conversationId as string | undefined);

    const selectedConversationIdRef = useRef(params.conversationId);

    useEffect(() => {
        selectedConversationIdRef.current = params.conversationId;
    }, [params.conversationId]);

    // Message map is keyed by conversation ID
    const [messages, setMessages] = useState<Map<string, MessageData[]>>(
        init.messages
    );

    const addMessage = useCallback(
        (message: MessageData) => {
            setMessages((oldMessages) => {
                const newMessages = new Map(oldMessages);
                const conversationMessages = newMessages.get(
                    message.conversationId
                );
                if (conversationMessages) {
                    conversationMessages.push(message);
                } else {
                    newMessages.set(message.conversationId, [message]);
                }
                return newMessages;
            });
        },
        [setMessages]
    );

    const addMessages = useCallback(
        (messages: MessageData[]) => {
            setMessages((oldMessages) => {
                const newMessages = new Map(oldMessages);
                for (const message of messages) {
                    const conversationMessages = newMessages.get(
                        message.conversationId
                    );
                    if (conversationMessages) {
                        conversationMessages.push(message);
                    } else {
                        newMessages.set(message.conversationId, [message]);
                    }
                }
                return newMessages;
            });
        },
        [setMessages]
    );

    // hasMore map is keyed by conversation ID
    const [hasMore, setHasMoreState] = useState<Map<string, boolean>>(
        init.hasMore
    );

    const setHasMore = useCallback(
        (id: string, hasMore: boolean) => {
            setHasMoreState((oldHasMore) => {
                const newHasMore = new Map(oldHasMore);
                newHasMore.set(id, hasMore);
                return newHasMore;
            });
        },
        [setHasMoreState]
    );

    const [conversations, setConversations] = useState(init.conversations);
    const addConversation = useCallback(
        (conversation: ConversationState) => {
            setConversations((oldConversations) => {
                const newConversations = new Map(oldConversations);
                newConversations.set(conversation.id, conversation);
                return newConversations;
            });

            setMessages((oldMessages) => {
                const newMessages = new Map(oldMessages);
                newMessages.set(conversation.id, []);
                return newMessages;
            });

            setHasMore(conversation.id, true);
        },
        [setConversations, setMessages, setHasMore]
    );

    const addMessageToFront = useCallback(
        (message: MessageData) => {
            setMessages((oldMessages) => {
                const newMessages = new Map(oldMessages);
                const conversationMessages = newMessages.get(
                    message.conversationId
                );
                if (conversationMessages) {
                    conversationMessages.unshift(message);
                } else {
                    newMessages.set(message.conversationId, [message]);
                }
                return newMessages;
            });

            setConversations((oldConversations) => {
                const newConversations = new Map(oldConversations);
                const conversation = newConversations.get(
                    message.conversationId
                );
                if (conversation) {
                    conversation.message = message.content;
                }
                return newConversations;
            });

            // Increase unread count if the message is not from the current user and the conversation is not selected
            if (message.userId !== userId) {
                setConversations((oldConversations) => {
                    const newConversations = new Map(oldConversations);
                    const conversation = newConversations.get(
                        message.conversationId
                    );
                    if (conversation) {
                        if (
                            conversation.id !==
                            selectedConversationIdRef.current
                        ) {
                            if (!conversation.unreadCount) {
                                conversation.unreadCount = 0;
                            }

                            conversation.unreadCount++;
                        } else {
                            // If the conversation is currently selected, reset the unreadCount
                            conversation.unreadCount = 0;
                        }
                    }
                    return newConversations;
                });
            }
        },
        [setMessages, setConversations, userId, selectedConversationIdRef]
    );

    useEffect(() => {
        // Clear unread count when conversation is selected
        if (selectedConversationId) {
            setConversations((oldConversations) => {
                const newConversations = new Map(oldConversations);
                const conversation = newConversations.get(
                    selectedConversationId
                );
                if (conversation) {
                    conversation.unreadCount = 0;
                }
                return newConversations;
            });
        }
    }, [selectedConversationId]);

    // Memoize the context value to prevent unnecessary re-renders
    const providerValue = useMemo(
        () => ({
            conversations,
            addConversation,
            selectedConversationId,
            setSelectedConversationId,
            messages,
            addMessage,
            addMessages,
            addMessageToFront,
            hasMore,
            setHasMore,
        }),
        [
            conversations,
            addConversation,
            selectedConversationId,
            messages,
            addMessage,
            addMessages,
            addMessageToFront,
            hasMore,
            setHasMore,
        ]
    );

    // Return the context with the provider value
    return (
        <ChatContext.Provider value={providerValue}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat(): ChatContextType {
    const context = useContext(ChatContext);
    if (!context) {
        // This error is for developers' benefit in development mode
        throw new Error("useChat must be used within an ChatProvider");
    }
    return context;
}
