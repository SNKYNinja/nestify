"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data?.user)
        }
        fetchUser()
    }, [supabase, mounted])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        window.location.href = "/signin"
    }

    // Don't render during SSR
    if (!mounted) return null

    return (
        <motion.nav
            className="w-full p-4 shadow-md bg-white fixed top-0 left-0 right-0 z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold flex items-center">
                    <motion.span
                        className="text-blue-600 mr-1"
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Nestify
                    </motion.span>
                    <span className="hidden sm:inline">- VIT Bhopal</span>
                </Link>

                {/* Mobile menu button */}
                <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Avatar className="h-8 w-8 border-2 border-blue-100">
                                        <AvatarImage
                                            src={
                                                user.user_metadata?.avatar_url ||
                                                "https://via.placeholder.com/150"
                                            }
                                        />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {user.user_metadata?.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:block">
                                        <p className="font-medium text-sm">
                                            {user.user_metadata?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                            {user.email}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/" className="w-full">
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/profile" className="w-full">
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-500 cursor-pointer"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                                <Link href="/signin">Sign In</Link>
                            </Button>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <motion.div
                    className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col space-y-4">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/get-started"
                            className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Onboarding
                        </Link>

                        {user ? (
                            <>
                                <div className="flex items-center gap-3 py-2">
                                    <Avatar>
                                        <AvatarImage
                                            src={
                                                user.user_metadata?.avatar_url ||
                                                "https://via.placeholder.com/150"
                                            }
                                        />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {user.user_metadata?.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.user_metadata?.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                    <Link href="/signin">Sign In</Link>
                                </Button>
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    )
}
