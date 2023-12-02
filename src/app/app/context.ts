"use client";

import { create } from "zustand";
import { ConversationState } from "@/components/Sidebar/Conversations/List";

export interface ConversationStoreState {
    conversations: Map<string, ConversationState>;
    addConversation: (conversation: ConversationState) => void;
    removeConversation: (conversationId: string) => void;
    updateConversation: (conversation: ConversationState) => void;
    hydrate: (conversations: Map<string, ConversationState>) => void;
    hasHydrated: boolean;
}

export const useConversationStore = create<ConversationStoreState>()((set) => ({
    conversations: new Map(),
    addConversation: (conversation) =>
        set((state) => ({
            conversations: state.conversations.set(
                conversation.id,
                conversation
            ),
        })),
    removeConversation: (conversationId) =>
        set((state) => {
            state.conversations.delete(conversationId);
            return {
                conversations: state.conversations,
            };
        }),
    updateConversation: (conversation) =>
        set((state) => ({
            conversations: state.conversations.set(
                conversation.id,
                conversation
            ),
        })),
    hydrate: (conversations) =>
        set((state) => ({
            conversations: new Map([...state.conversations, ...conversations]),
            hasHydrated: true,
        })),
    hasHydrated: false,
}));
