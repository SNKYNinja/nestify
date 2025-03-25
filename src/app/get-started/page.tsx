"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function GetStarted() {
    const supabase = createClient()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({
        name: "",
        registration_no: "",
        email: "",
        mobile: "",
        home_address: "",
        guardian_type: "",
        guardian_name: "",
        guardian_phone: "",
        gender: "",
        hostel_block: "",
        room_no: "",
        mess: "",
        photo: null as File | null,
    })

    useEffect(() => {
        const fetchUser = async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user?.user || user.user.user_metadata?.role !== "student") {
                router.push("/")
                return
            }

            const email = user.user.email!
            const registration_no = email.split(".")[1].split("@")[0].toUpperCase()

            setForm((prev) => ({
                ...prev,
                name: user.user.user_metadata?.name || "",
                email,
                registration_no,
            }))
            setLoading(false)
        }
        fetchUser()
    }, [router, supabase])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm((prev) => ({ ...prev, photo: e.target.files![0] }))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 5))
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)

        try {
            // Upload photo if exists
            let photo_url = null
            if (form.photo) {
                // const filePath = `passport/${form.registration_no}`
                // console.log(form)
                // console.log("Photo type:", form.photo instanceof File, form.photo)
                // const { data: uploadData, error: uploadError } = await supabase.storage
                //     .from("photos")
                //     .upload(filePath, form.photo, {
                //         cacheControl: "3600",
                //         upsert: true,
                //     })
                //
                // console.log("Just Above Upload Error")
                // if (uploadError) throw uploadError
                //
                // photo_url = uploadData.path
            }

            // Insert student data
            console.log("Heres your form data baka...")
            const { error } = await supabase.from("students").insert({
                ...form,
                photo: photo_url,
            })

            if (error) throw error

            router.push("/")
        } catch (error) {
            console.error("Error submitting form:", error)
            // You could add error handling UI here
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-center mb-4">Hostel Onboarding</h2>

                {/* Step 1: Personal Details */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" name="name" value={form.name} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="registrationNo">Registration No.</Label>
                            <Input
                                id="registrationNo"
                                type="text"
                                name="registrationNo"
                                value={form.registration_no}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                required
                            />
                            {form.mobile && !/^[0-9]{10}$/.test(form.mobile) && (
                                <p className="text-sm text-red-500">
                                    Please enter a valid 10-digit mobile number
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="homeAddress">Home Address</Label>
                            <Input
                                id="homeAddress"
                                type="text"
                                name="home_address"
                                value={form.home_address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo">Passport Size Photo</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={handleNext}
                                disabled={
                                    !form.mobile ||
                                    !form.home_address ||
                                    !/^[0-9]{10}$/.test(form.mobile)
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Guardian Details */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="guardianType">Guardian Type</Label>
                            <Select
                                value={form.guardian_type}
                                onValueChange={(value) =>
                                    setForm((prev) => ({ ...prev, guardian_type: value }))
                                }
                            >
                                <SelectTrigger id="guardianType">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Father">Father</SelectItem>
                                    <SelectItem value="Mother">Mother</SelectItem>
                                    <SelectItem value="Relative">Relative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guardianName">Guardian Name</Label>
                            <Input
                                id="guardianName"
                                type="text"
                                name="guardian_name"
                                value={form.guardian_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guardianPhone">Guardian Phone</Label>
                            <Input
                                id="guardianPhone"
                                type="tel"
                                name="guardian_phone"
                                value={form.guardian_phone}
                                onChange={handleChange}
                                placeholder="10-digit phone number"
                                required
                            />
                            {form.guardian_phone && !/^[0-9]{10}$/.test(form.guardian_phone) && (
                                <p className="text-sm text-red-500">
                                    Please enter a valid 10-digit phone number
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={
                                    !form.guardian_type ||
                                    !form.guardian_name ||
                                    !form.guardian_phone ||
                                    !/^[0-9]{10}$/.test(form.guardian_phone)
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Hostel Details */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={form.gender}
                                onValueChange={(value) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        gender: value,
                                        // Reset dependent fields when gender changes
                                        hostel_block: "",
                                        mess: "",
                                    }))
                                }}
                            >
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Boys">Boys</SelectItem>
                                    <SelectItem value="Girls">Girls</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {form.gender && (
                            <div className="space-y-2">
                                <Label htmlFor="hostelBlock">Hostel Block</Label>
                                <Select
                                    value={form.hostel_block}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({ ...prev, hostel_block: value }))
                                    }
                                >
                                    <SelectTrigger id="hostelBlock">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {form.gender === "Boys"
                                            ? [
                                                  "Hostel Block 1",
                                                  "Hostel Block 2",
                                                  "Hostel Block 3",
                                                  "Hostel Block 4",
                                                  "Hostel Block 5",
                                                  "Hostel Block 6",
                                                  "Amenity Block",
                                                  "Dining Hall",
                                              ].map((block) => (
                                                  <SelectItem key={block} value={block}>
                                                      {block}
                                                  </SelectItem>
                                              ))
                                            : ["Hostel Block 1", "Hostel Block 2"].map((block) => (
                                                  <SelectItem key={block} value={block}>
                                                      {block}
                                                  </SelectItem>
                                              ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="roomNo">Room No</Label>
                            <Input
                                id="roomNo"
                                type="text"
                                name="room_no"
                                value={form.room_no}
                                onChange={handleChange}
                                placeholder="e.g. A101, B202"
                                required
                            />
                            {form.room_no && !/^[A-D][0-9]{3}$/.test(form.room_no) && (
                                <p className="text-sm text-red-500">
                                    Room number must start with a letter (A-D) followed by 3 digits
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={
                                    !form.gender ||
                                    !form.hostel_block ||
                                    !form.room_no ||
                                    !/^[A-D][0-9]{3}$/.test(form.room_no)
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Mess Details */}
                {step === 4 && (
                    <div className="space-y-4">
                        {form.gender && (
                            <div className="space-y-2">
                                <Label htmlFor="mess">Mess</Label>
                                <Select
                                    value={form.mess}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({ ...prev, mess: value }))
                                    }
                                >
                                    <SelectTrigger id="mess">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {form.gender === "Boys" ? (
                                            ["CRCL", "Mayuri", "Safal", "JMB"].map((mess) => (
                                                <SelectItem key={mess} value={mess}>
                                                    {mess}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="AB">AB</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                            <Button onClick={handleNext} disabled={!form.mess}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 5: Review Details */}
                {step === 5 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Review Your Details</h3>

                        <div className="space-y-3 border rounded-md p-4">
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Name:</p>
                                <p className="text-sm">{form.name}</p>

                                <p className="text-sm font-medium">Registration No:</p>
                                <p className="text-sm">{form.registration_no}</p>

                                <p className="text-sm font-medium">Email:</p>
                                <p className="text-sm">{form.email}</p>

                                <p className="text-sm font-medium">Mobile:</p>
                                <p className="text-sm">{form.mobile}</p>

                                <p className="text-sm font-medium">Home Address:</p>
                                <p className="text-sm">{form.home_address}</p>

                                <p className="text-sm font-medium">Photo:</p>
                                <p className="text-sm">
                                    {form.photo ? form.photo.name : "Not uploaded"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 border rounded-md p-4">
                            <h4 className="text-md font-medium">Guardian Details</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Guardian Type:</p>
                                <p className="text-sm">{form.guardian_type}</p>

                                <p className="text-sm font-medium">Guardian Name:</p>
                                <p className="text-sm">{form.guardian_name}</p>

                                <p className="text-sm font-medium">Guardian Phone:</p>
                                <p className="text-sm">{form.guardian_phone}</p>
                            </div>
                        </div>

                        <div className="space-y-3 border rounded-md p-4">
                            <h4 className="text-md font-medium">Hostel Details</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Gender:</p>
                                <p className="text-sm">{form.gender}</p>

                                <p className="text-sm font-medium">Hostel Block:</p>
                                <p className="text-sm">{form.hostel_block}</p>

                                <p className="text-sm font-medium">Room No:</p>
                                <p className="text-sm">{form.room_no}</p>

                                <p className="text-sm font-medium">Mess:</p>
                                <p className="text-sm">{form.mess}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
