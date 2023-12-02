import { ChatContextType } from "../chat.context";
import { z } from "zod";
import {
    HandleIncomingCHAT_MESSAGE_RECEIVED,
    Z_WSPayloadCHAT_MESSAGE_RECEIVED,
} from "./events/CHAT_MESSAGE_RECEIVED";
import {
    HandleIncomingCONVERSATION_CREATED,
    Z_WSPayloadCONVERSATION_CREATED,
} from "./events/CONVERSATION_CREATED";

export enum WSMessageType {
    CHAT_MESSAGE_RECEIVED = "CHAT_MESSAGE_RECEIVED",
    CHAT_MESSAGE_DELETED = "CHAT_MESSAGE_DELETED",
    CHAT_MESSAGE_EDITED = "CHAT_MESSAGE_EDITED",
    CHAT_MESSAGE_REACTION_ADDED = "CHAT_MESSAGE_REACTION_ADDED",
    CHAT_MESSAGE_REACTION_REMOVED = "CHAT_MESSAGE_REACTION_REMOVED",
    CONVERSATION_CREATED = "CONVERSATION_CREATED",
    CONVERSATION_DELETED = "CONVERSATION_DELETED",
}

const parser = z.strictObject({
    type: z.nativeEnum(WSMessageType),
    payload: z.unknown(),
});

export function HandleIncomingWSMessage(
    message: unknown,
    chat: ChatContextType
) {
    try {
        const parsedMessage = parser.parse(message);
        if (!parsedMessage) {
            console.error("Parsed message is undefined");
            return;
        }

        switch (parsedMessage.type) {
            case WSMessageType.CHAT_MESSAGE_RECEIVED:
                return HandleIncomingCHAT_MESSAGE_RECEIVED(
                    Z_WSPayloadCHAT_MESSAGE_RECEIVED.parse(
                        parsedMessage.payload
                    ),
                    chat
                );
            case WSMessageType.CONVERSATION_CREATED:
                return HandleIncomingCONVERSATION_CREATED(
                    Z_WSPayloadCONVERSATION_CREATED.parse(
                        parsedMessage.payload
                    ),
                    chat
                );
            default:
                console.warn(
                    `Received unknown message type: ${parsedMessage.type}`
                );
                return;
        }
    } catch (error) {
        console.error(`Failed to parse incoming message: ${error}`);
    }
}
