"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";
import { UserData, signup } from "@/auth/server";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

export default function Signup() {
    const { setLogin } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (isLoading) return;

        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("username");
        if (typeof username !== "string") return;
        if (!username) return;
        if (username.length < 3) return;
        if (username.length > 16) return;
        if (!/^[a-zA-Z0-9]+$/.test(username)) return;

        const password = formData.get("password");
        if (typeof password !== "string") return;
        if (!password) return;

        setIsLoading(true);

        let signupResult: UserData;
        try {
            signupResult = await signup(username, password);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            return;
        }

        setLogin(signupResult.id, signupResult.username);

        // Go to /app
        router.replace("/app");
    };

    return (
        <main className={styles.main}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <h1 className={styles.logo}>Chirpy</h1>
                    <p className={styles.description}>Sign up for an account</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="username"
                        name="username"
                        id="username"
                        placeholder="username"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                    />
                    <button type="submit" className={styles.submit}>
                        {isLoading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>
                <div className={styles.errorBox}></div>
                <p className={styles.signupPrompt}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.link}>
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
