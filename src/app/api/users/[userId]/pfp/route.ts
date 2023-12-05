import { getServerSession } from "@/auth/server";
import { getBackendURL } from "@/utils";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface Params {
    userId: string;
}

export async function GET(
    request: NextRequest,
    { params: { userId } }: { params: Params }
) {
    const session = await getServerSession();
    if (!session) {
        return Response.error();
    }

    let response = await fetch(
        new URL(`api/users/${userId}`, getBackendURL()),
        {
            cache: "no-cache",
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.sessionToken}`,
            },
        }
    );

    if (!response.ok) {
        console.log("Error getting user");
        return Response.redirect(new URL("/pfp.jpg", request.url));
    }

    let json = await response.json();

    let pfpResponse = await fetch(json.avatarURL, {
        method: "GET",
    });

    if (!pfpResponse.ok) {
        console.log("Error getting pfp");
        return Response.redirect(new URL("/pfp.jpg", request.url));
    }

    let pfp = await pfpResponse.blob();

    return new Response(pfp, {
        headers: {
            "Content-Type": "image/png",
            // Disable caching
            "Cache-Control": "no-store",
        },
    });
}
