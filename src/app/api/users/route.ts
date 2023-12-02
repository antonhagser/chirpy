import { getServerSession } from "@/auth/server";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const inputValue = request.nextUrl.searchParams.get("query");
    if (!inputValue) {
        return Response.json([]);
    }

    const session = await getServerSession();
    if (!session) {
        return Response.json([]);
    }

    let response = await fetch(
        ` https://messaging-negotiate-func-dev.azurewebsites.net/api/users?query=${inputValue}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.sessionToken}`,
            },
        }
    );

    if (!response.ok) {
        return Response.json([]);
    }

    let data: { users: { id: string; username: string }[] } =
        await response.json();
    if (!data) {
        return Response.json([]);
    }

    let filteredResponse = data.users
        .filter((x) => x.id != session.id)
        .map((user: any) => ({
            label: user.username,
            value: user.id,
        }));

    return Response.json(filteredResponse);
}
