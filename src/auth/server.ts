"use server";

import { SessionPayload, validateSession } from "@/server/session";
import { cookies } from "next/headers";
import { Session } from "./session";
import { getAuthBackendURL, getBackendURL } from "@/utils";

export async function getServerSession(): Promise<Session | null> {
    "use server";

    // Get the client token from the cookie
    const cookieStore = cookies();

    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie) {
        return null;
    }

    // Validate the token
    let session: SessionPayload;
    try {
        session = await validateSession(sessionCookie.value);
    } catch (err) {
        return null;
    }

    return {
        id: session.id,
        username: session.username,
        sessionToken: sessionCookie.value,
    };
}

export interface UserData {
    id: string;
    username: string;
}

export async function login(
    formUsername: string,
    formPassword: string
): Promise<UserData> {
    "use server";

    // Send the username to the backend
    // If the username is valid, set a cookie with the session token
    // If the username is invalid, throw an error

    const response = await fetch(
        new URL("api/httpLogin", getAuthBackendURL()),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formUsername,
                password: formPassword,
            }),
            cache: "no-cache",
        }
    );

    if (!response.ok) {
        throw new Error("Invalid username: " + (await response.text()));
    }

    // Get the session token from the response
    const { id, username, token } = await response.json();

    // Set session cookie with the token
    cookies().set("session", token, {
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    });

    return {
        id,
        username,
    };
}

export async function signup(formUsername: string, formPassword: string): Promise<UserData> {
    "use server";

    // Send the username to the backend
    // If the username is valid, set a cookie with the session token
    // If the username is invalid, throw an error

    const response = await fetch(
        new URL("api/httpRegister", getAuthBackendURL()),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formUsername,
                password: formPassword,
            }),
            cache: "no-cache",
        }
    );

    if (!response.ok) {
        throw new Error("Invalid username");
    }

    // Get the session token from the response
    const { id, username, token } = await response.json();

    // Set session cookie with the token
    cookies().set("session", token, {
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    });

    return {
        id,
        username,
    };
}
