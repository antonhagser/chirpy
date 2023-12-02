import clsx from "clsx";
import Image from "next/image";

import styles from "./Conversation.module.css";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";

interface Props {
    className?: string;
    id: string;
    avatarURL: string | StaticImport;
    presence: "online" | "offline" | "idle";
    name: string;
    message: string;
    selected?: boolean;
    unreadCount?: number;
    onClick?: (id: string) => void;
}

export default function ConversationItem({
    className,
    id,
    avatarURL,
    presence,
    name,
    message,
    selected,
    unreadCount,
    onClick,
}: Props) {
    return (
        <li className={styles.conversationListItem}>
            <Link
                href={`/app/conversation/${id}`}
                className={clsx(
                    styles.conversation,
                    selected && styles.selected,
                    className
                )}
                onClick={() => onClick && onClick(id)}
            >
                <div className={styles.aboutConversation}>
                    <div className={styles.conversationProfile}>
                        <div
                            className={clsx(
                                styles.conversationAvatar,
                                styles.unselectable
                            )}
                        >
                            <Image
                                src={avatarURL}
                                alt="pfp"
                                width="40"
                                height="40"
                                className={styles.conversationAvatarImage}
                            />
                        </div>
                        <div
                            className={clsx(
                                styles.userPresence,
                                presence == "online" &&
                                    styles.userPresenceOnline,
                                presence == "offline" &&
                                    styles.userPresenceOffline,
                                presence == "idle" && styles.userPresenceIdle
                            )}
                        >
                            <svg viewBox="0 0 24 24">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="inherit"
                                    stroke="inherit"
                                    strokeWidth="3"
                                />
                            </svg>
                        </div>
                    </div>
                    <div
                        className={clsx(
                            styles.conversationInfo,
                            styles.unselectable
                        )}
                    >
                        <div className={clsx(styles.conversationName)}>
                            {name}
                        </div>
                        <div className={clsx(styles.conversationMessage)}>
                            {message}
                        </div>
                    </div>
                </div>
                {unreadCount && unreadCount > 0 ? (
                    <div
                        className={clsx(
                            styles.conversationUnread,
                            styles.unselectable
                        )}
                    >
                        <span className={styles.conversationUnreadCount}>
                            {unreadCount > 10 ? <>+</> : null}
                            {unreadCount > 10 ? 10 : unreadCount}
                        </span>
                    </div>
                ) : null}
            </Link>
        </li>
    );
}
