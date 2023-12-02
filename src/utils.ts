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
