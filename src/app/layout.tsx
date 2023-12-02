import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getServerSession } from "@/auth/server";
import { AuthProvider } from "../context/auth.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chirpy - Home",
    description: "",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get the session from the server and pass it to the AuthProvider
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider
                    init={{
                        isSignedIn: !!session,
                        userId: session?.id ?? null,
                        username: session?.username ?? null,
                    }}
                >
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
