import { z } from "zod";
import { WSMessageType } from "../handle";
import { ChatContextType } from "@/context/chat.context";
import { ConversationState } from "@/components/Sidebar/Conversations/List";

/// CONVERSATION_CREATED
export const Z_WSPayloadCONVERSATION_CREATED = z.object({
    id: z.string().uuid(),
    name: z.string(),
    members: z.array(
        z.object({
            id: z.string().uuid(),
            username: z.string(),
            avatarURL: z.string().url().optional(),
        })
    ),
});

type WSPayloadCONVERSATION_CREATED = z.infer<
    typeof Z_WSPayloadCONVERSATION_CREATED
>;

export function HandleIncomingCONVERSATION_CREATED(
    payload: WSPayloadCONVERSATION_CREATED,
    chat: ChatContextType
) {
    const conv: ConversationState = {
        id: payload.id,
        name: payload.name,
        avatarURL: "/pfp.jpeg",
        presence: "online",
        message: "",
    };

    chat.addConversation(conv);

    // Set the active conversation id if there is none
    if (chat.selectedConversationId === null) {
        console.log(`Setting active conversation id to ${payload.id}`);
        console.log(
            "Current active conversation id is null, ",
            chat.selectedConversationId
        );

        chat.setSelectedConversationId(payload.id);
        console.log(
            "Updated active conversation id: ",
            chat.selectedConversationId
        ); // Add this line
    }
}
