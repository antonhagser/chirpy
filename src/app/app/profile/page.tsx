"use client";

import { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";
import { useRef, useState } from "react";
import { uploadPfp } from "@/server/user";
import { useAuth } from "@/context/auth.context";

export default function Profile() {
    const { userId } = useAuth();

    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const errorRef = useRef(error);

    const handleFileSelect = (event: any) => {
        const file = event.target.files[0];
        const maxSize = 1024 * 1024; // 1MB

        if (file.size > maxSize) {
            setError("File is too large, please select a file less than 1MB.");
        } else {
            setError(""); // clear the error message
            setFileName(file.name);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        if (errorRef.current) {
            return;
        }

        try {
            await uploadPfp(formData);
        } catch (err) {
            console.error(err);
            return;
        }

        console.log(formData.get("avatar"));
    };

    return (
        <main className={styles.main}>
            <h2 className={styles.header}>Profile</h2>
            <Image
                src={`/api/users/${userId}/pfp`}
                alt="pfp"
                width="256"
                height="256"
                className={styles.avatar}
            />
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fileBrowser}>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        className={styles.inputFile}
                        onChange={handleFileSelect}
                    />
                    <label htmlFor="avatar" className={styles.browseButton}>
                        Browse
                    </label>
                    <p className={styles.fileName}>{fileName}</p>
                </div>
                <button type="submit" className={styles.submit}>
                    Submit
                </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </main>
    );
}
