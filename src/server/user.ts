"use server";

import { getServerSession } from "@/auth/server";
import { getBackendURL } from "@/utils";

export async function uploadPfp(formData: FormData) {
    "use server";

    const session = await getServerSession();
    if (!session) {
        throw new Error("User is not logged in");
    }

    const response = await fetch(new URL("/api/users/pfp", getBackendURL()), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session.sessionToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}
