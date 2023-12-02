import { z } from "zod";
import { WSMessageType } from "../handle";
import { ChatContextType } from "@/context/chat.context";

export const Z_WSPayloadCHAT_MESSAGE_RECEIVED = z.object({
    id: z.string().uuid(),
    conversationId: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string(),
    createdAt: z.string().refine((s) => !isNaN(Date.parse(s))),
    updatedAt: z.string().refine((s) => !isNaN(Date.parse(s))),
});

type WSPayloadCHAT_MESSAGE_RECEIVED = z.infer<
    typeof Z_WSPayloadCHAT_MESSAGE_RECEIVED
>;

export function HandleIncomingCHAT_MESSAGE_RECEIVED(
    message: WSPayloadCHAT_MESSAGE_RECEIVED,
    chat: ChatContextType
) {
    chat.addMessageToFront(message);
}
