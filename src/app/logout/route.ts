import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    // Remove cookie
    cookies().delete("session");

    return NextResponse.redirect(new URL("/login", request.url));
}
