/**
 * Checks if a string is a valid UUID.
 * @param str The string to check.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export function isUUID(str: string): boolean {
    const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
}

export function getBackendURL(): string {
    return process.env.BACKEND_URL ?? "http://127.0.0.1:7071/";
}

export function getAuthBackendURL(): string {
    return process.env.AUTH_BACKEND_URL ?? "http://127.0.0.1:7072/";
}
