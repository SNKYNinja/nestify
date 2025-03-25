"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    MapPin,
    Phone,
    Mail,
    User,
    Home,
    Utensils,
    Building,
    DoorClosed,
    UserPlus,
} from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"

type StudentData = {
    id: string
    name: string
    registration_no: string
    email: string
    mobile: string
    home_address: string
    guardian_type: string
    guardian_name: string
    guardian_phone: string
    gender: string
    hostel_block: string
    room_no: string
    mess: string
    photo: string | null
    created_at: string
}

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function DashboardPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [student, setStudent] = useState<StudentData | null>(null)
    const [user, setUser] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    // Fix hydration issues by only rendering after component is mounted
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const fetchData = async () => {
            try {
                setLoading(true)

                // Get current user
                const { data: userData, error: userError } = await supabase.auth.getUser()

                if (userError || !userData.user) {
                    console.error("Error fetching user:", userError)
                    return
                }

                setUser(userData.user)

                // Get student data
                const { data: studentData, error: studentError } = await supabase
                    .from("students")
                    .select("*")
                    .eq("email", userData.user.email)
                    .single()

                if (studentError && studentError.code !== "PGRST116") {
                    console.error("Error fetching student data:", studentError)
                    return
                }

                setStudent(studentData)
            } catch (error) {
                console.error("Error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [supabase, mounted])

    const handleOnboarding = () => {
        router.push("/get-started")
    }

    // Don't render anything during SSR to prevent hydration errors
    if (!mounted) return null

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="pt-16">
                    <DashboardSkeleton />
                </div>
            </>
        )
    }

    if (!student) {
        return (
            <>
                <Navbar />
                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 pt-20"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <Card className="w-full max-w-3xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Welcome to Nestify</CardTitle>
                            <CardDescription>
                                You haven't completed your hostel onboarding yet.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    onClick={handleOnboarding}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Complete Onboarding
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <motion.div
                className="flex flex-col min-h-screen bg-gray-50 pt-16"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <main className="flex-1 container mx-auto px-4 py-8">
                    <motion.div className="grid gap-6 md:grid-cols-3" variants={slideUp}>
                        <div className="md:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card>
                                    <CardContent className="pt-6 flex flex-col items-center text-center">
                                        <Avatar className="h-24 w-24 mb-4">
                                            {student.photo ? (
                                                <AvatarImage
                                                    src={student.photo}
                                                    alt={student.name}
                                                />
                                            ) : (
                                                <AvatarFallback className="text-lg bg-blue-600 text-white">
                                                    {student.name.charAt(0)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <h2 className="text-xl font-bold">{student.name}</h2>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {student.registration_no}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="mb-4 bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                            {student.gender}
                                        </Badge>
                                        <div className="w-full space-y-2 text-sm">
                                            <div className="flex items-center">
                                                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                                                <span className="text-muted-foreground">
                                                    {student.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                                                <span className="text-muted-foreground">
                                                    {student.mobile}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                                <span className="text-muted-foreground truncate">
                                                    {student.home_address}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="md:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Tabs defaultValue="hostel" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-blue-50">
                                        <TabsTrigger
                                            value="hostel"
                                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                        >
                                            Hostel
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="guardian"
                                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                        >
                                            Guardian
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="mess"
                                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                        >
                                            Mess
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="hostel" className="mt-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Hostel Information</CardTitle>
                                                    <CardDescription>
                                                        Your current hostel accommodation details
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center">
                                                        <Building className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Hostel Block
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.hostel_block}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <DoorClosed className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Room Number
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.room_no}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>

                                    <TabsContent value="guardian" className="mt-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Guardian Information</CardTitle>
                                                    <CardDescription>
                                                        Your emergency contact details
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center">
                                                        <User className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Guardian Type
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.guardian_type}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <User className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Guardian Name
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.guardian_name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Phone className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Guardian Phone
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.guardian_phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>

                                    <TabsContent value="mess" className="mt-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Mess Information</CardTitle>
                                                    <CardDescription>
                                                        Your dining facility details
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="flex items-center">
                                                        <Utensils className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Mess Name
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.mess}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Home className="h-5 w-5 mr-3 text-blue-600" />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                Mess Location
                                                            </p>
                                                            <p className="text-lg">
                                                                {student.gender === "Boys"
                                                                    ? student.mess === "CRCL"
                                                                        ? "Boys Hostel Block 1"
                                                                        : student.mess === "Mayuri"
                                                                          ? "Boys Hostel Block 3"
                                                                          : "Dining Hall, Boys Hostel Block 6"
                                                                    : "Girl Hostel"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        </div>
                    </motion.div>
                </main>
            </motion.div>
        </>
    )
}

function DashboardSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-5 w-20 mb-4" />
                                <div className="w-full space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Skeleton className="h-10 w-full mb-4" />
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-60" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
