"use client";

import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { ChevronUp, ChevronDown, User2, Settings2, LogOut } from "lucide-react";

import styles from "./Profile.module.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth.context";

interface Props {
    className?: string;
}

export default function Profile({ className }: Props) {
    // Get the username from the auth context
    const { username } = useAuth();

    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!isOpen);
    };

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const menuClass = clsx(styles.menu, {
        [styles.open]: isOpen,
    });

    return (
        <div className={clsx(styles.profile, className)} ref={dropdownRef}>
            <div className={styles.dropdown}>
                <button
                    className={styles["dropdown-button"]}
                    onClick={handleOpen}
                >
                    <span>{username}</span>
                    {isOpen ? (
                        <span className={styles["dropdown-icon"]}>
                            <ChevronUp />
                        </span>
                    ) : (
                        <span className={styles["dropdown-icon"]}>
                            <ChevronDown />
                        </span>
                    )}
                </button>
                <ul className={menuClass}>
                    {/* <li className={styles["menu-item"]}>
                        <Link
                            href="/app/profile/"
                            className={styles["menu-button"]}
                            onClick={() => setOpen(false)}
                        >
                            <span className={styles["menu-icon"]}>
                                <User2 />
                            </span>
                            <span className={styles["menu-label"]}>
                                Profile
                            </span>
                        </Link>
                    </li> */}
                    <li
                        className={clsx(
                            styles["menu-item"],
                            styles["menu-item-alert"]
                        )}
                    >
                        <Link
                            href="/logout"
                            className={styles["menu-button"]}
                            onClick={() => setOpen(false)}
                        >
                            <span className={styles["menu-icon"]}>
                                <LogOut />
                            </span>
                            <span className={styles["menu-label"]}>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
