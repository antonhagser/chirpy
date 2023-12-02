import type { Metadata } from "next";
import styles from "./layout.module.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Content from "@/components/Content/Content";
import { ConversationState } from "@/components/Sidebar/Conversations/List";
import { ChatProvider } from "@/context/chat.context";
import SplitLayout from "@/components/SplitLayout/SplitLayout";
import { getServerSession } from "@/auth/server";
import { WSProvider } from "../../context/ws.context";
import WSConnector from "@/components/WSConnector/WSConnector";
import { MessageData } from "@/models/conversation";

export const metadata: Metadata = {
    title: "Chirpy",
    description: "",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const preloadState = async () => {
        const session = await getServerSession();
        if (!session) {
            throw new Error("Failed to get session");
        }

        const response = await fetch(
            " https://messaging-negotiate-func-dev.azurewebsites.net/api/conversations",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session.sessionToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();

        const conversations: Map<string, ConversationState> = new Map();
        const hasMore: Map<string, boolean> = new Map();
        const messages: Map<string, MessageData[]> = new Map();
        for (const conversation of data) {
            conversations.set(conversation.id, {
                id: conversation.id,
                name: conversation.name,
                avatarURL: "/pfp.jpeg",
                presence: "online",
                message: conversation?.message?.content,
                unreadCount: 0,
            });

            hasMore.set(conversation.id, true);
            messages.set(conversation.id, []);
        }

        return { conversations, hasMore, messages };
    };

    const negotiateWSConnection = async () => {
        const session = await getServerSession();
        if (!session) {
            return;
        }

        const response = await fetch(" https://messaging-negotiate-func-dev.azurewebsites.net/api/negotiateWS", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.sessionToken}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch conversations");
            return;
        }

        const data = await response.json();

        return data.url;
    };

    const preloadedState = await preloadState();
    const wsURL = await negotiateWSConnection();

    return (
        <ChatProvider
            init={{
                conversations: preloadedState.conversations,
                hasMore: preloadedState.hasMore,
                messages: preloadedState.messages,
            }}
        >
            <WSProvider>
                <WSConnector wsURL={wsURL} />
                <main className={styles.main}>
                    <div className={styles["content-wrapper"]}>
                        <Header className={styles.header} />
                        <SplitLayout>
                            <Sidebar />
                            <Content className={styles.content}>{children}</Content>
                        </SplitLayout>
                    </div>
                </main>
            </WSProvider>
        </ChatProvider>
    );
}
