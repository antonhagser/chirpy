export interface ConversationData {
    id: string;
    name: string;
    participants: string[];
    latestMessage: string; // MessageData;
}

export interface MessageData {
    id: string;
    conversationId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
