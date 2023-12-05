import { redirect } from "next/navigation";

import { isUUID } from "@/utils";

import Input from "@/components/Input/Input";
import MessageHolder from "@/components/MessageHolder/MessageHolder";
import styles from "./page.module.css";
import ConversationUpdater from "@/components/ConversationUpdater/ConversationUpdater";

const validateConversationId = (conversationId: string) => {
    if (!isUUID(conversationId)) {
        redirect("/app");
    }
};

export default function Conversation({
    params,
}: {
    params: {
        conversationId: string;
    };
}) {
    // Get and validate the conversation ID
    const conversationId = params.conversationId;
    validateConversationId(conversationId);

    return (
        <>
            <div className={styles.conversation}>
                <ConversationUpdater conversationId={conversationId} />
                <MessageHolder selectedConversationId={params.conversationId} />
                <Input
                    selectedConversationId={params.conversationId}
                    className={styles.input}
                />
            </div>
        </>
    );
}
