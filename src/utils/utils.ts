import { redirect } from "next/navigation"

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 */
export function encodedRedirect(type: "error" | "success", path: string, message: string) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}
