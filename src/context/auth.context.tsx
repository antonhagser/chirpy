"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface AuthContextInit {
    isSignedIn: boolean;
    userId: string | null;
    username: string | null;
}

interface AuthContextType {
    isSignedIn: boolean;
    userId: string | null;
    username: string | null;

    setLogin: (userId: string, username: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
    init,
}: {
    children: React.ReactNode;
    init: AuthContextInit;
}) {
    const [isSignedIn, setIsSignedIn] = useState(init.isSignedIn);
    const [userId, setUserId] = useState(init.userId);
    const [username, setUsername] = useState(init.username);

    const setLogin = useCallback((userId: string, username: string) => {
        setIsSignedIn(true);
        setUserId(userId);
        setUsername(username);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const providerValue = useMemo(
        () => ({
            isSignedIn,
            userId,
            username,
            setLogin,
        }),
        [isSignedIn, userId, username, setLogin]
    );

    // Return the context with the provider value
    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        // This error is for developers' benefit in development mode
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
