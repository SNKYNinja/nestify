"use server"

import { createClient } from "@/utils/supabase/server"

export const isLoggedIn = async () => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return Boolean(user)
}

export const signUpAction = async (formData: FormData) => {}
export const signInAction = async (formData: FormData) => {}
