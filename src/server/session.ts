export interface SessionPayload {
    id: string;
    username: string;
}

export async function validateSession(
    sessionToken: string
): Promise<SessionPayload> {
    "use server";

    // Currently always does a call and validates the token on the server, but could be changed to a JWT public key endpoint
    // and then validated on the client
    const response = await fetch(" https://messaging-negotiate-func-dev.azurewebsites.net/api/verify", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Invalid session");
    }

    const data = await response.json();
    return { id: data.id, username: data.username };
}
