import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "./auth/server";

export async function middleware(request: NextRequest) {
    const session = await getServerSession();
    if (
        !session &&
        !["/login", "/signup", "/logout"].includes(request.nextUrl.pathname)
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If the session is valid and the user is trying to access /login /signup or / redirect to /app
    if (
        session &&
        ["/", "/login", "/signup"].includes(request.nextUrl.pathname)
    ) {
        return NextResponse.redirect(new URL("/app", request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
