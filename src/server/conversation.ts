"use server";

import { getServerSession } from "@/auth/server";
import { ConversationData, MessageData } from "@/models/conversation";

interface PaginateMessagesResponse {
    messages: MessageData[];
    hasMore: boolean;
}

export async function paginateMessages(
    conversationId: string,
    limit: number,
    lastMessageCreatedAt: string | null
): Promise<PaginateMessagesResponse> {
    "use server";

    // Build URL
    let url = new URL(
        ` https://messaging-negotiate-func-dev.azurewebsites.net/api/conversations/${conversationId}/messages`
    );
    url.searchParams.set("limit", limit.toString());
    if (lastMessageCreatedAt) {
        url.searchParams.set("lastMessageCreatedAt", lastMessageCreatedAt);
    }

    const session = await getServerSession();
    if (!session) {
        throw new Error("User is not logged in");
    }

    const result = await fetch(url.toString(), {
        cache: "no-cache",
        method: "GET",
        headers: {
            Authorization: `Bearer ${session.sessionToken}`,
        },
    });

    if (!result.ok) {
        throw new Error("Failed to fetch messages: " + result.status);
    }

    return await result.json();
}

/**
 * Create a new conversation
 */
export async function createConversation(members: string[]) {
    "use server";

    const session = await getServerSession();
    if (!session) {
        throw new Error("User is not logged in");
    }

    // Add self to members
    members.push(session.id);

    const result = await fetch(" https://messaging-negotiate-func-dev.azurewebsites.net/api/conversations", {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.sessionToken}`,
        },
        body: JSON.stringify({
            members,
        }),
    });

    if (!result.ok) {
        console.error(await result.text());
        return;
    }

    return;
}

export async function sendMessage(conversationId: string, content: string) {
    "use server";

    const session = await getServerSession();
    if (!session) {
        throw new Error("User is not logged in");
    }

    const result = await fetch(
        ` https://messaging-negotiate-func-dev.azurewebsites.net/api/conversations/${conversationId}/messages`,
        {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.sessionToken}`,
            },
            body: JSON.stringify({
                message: content,
            }),
        }
    );

    if (!result.ok) {
        console.error(await result.text());
        return;
    }

    return;
}
