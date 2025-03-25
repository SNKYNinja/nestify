"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
    const router = useRouter()
    const supabase = createClient()
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            const { data: user } = await supabase.auth.getUser()
            if (user?.user) {
                router.push("/dashboard")
            }
        }
        checkUser()
    }, [router, supabase])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (!form.email.endsWith("@vitbhopal.ac.in")) {
            setError("Only VIT Bhopal emails are allowed")
            setLoading(false)
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: { name: form.name, role: "student" },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/get-started")
        }
    }

    if (!isMounted) return null // Prevents hydration issues

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-md"
            >
                <h2 className="text-xl font-semibold text-center">Sign Up</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Signing Up...
                        </div>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
                <p className="text-center text-sm mt-2">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-blue-500">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    )
}
