"use client"

import { useAppDispatch } from "@/store/hooks"
import { logoutUser, setUser } from "@/store/slices/userSlice";
import { useEffect } from "react"

export default function UpdateState({ isAuthenticated, userData }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        isAuthenticated ? dispatch(setUser(userData)) : dispatch(logoutUser())
    }, [])
    return <p className="">{isAuthenticated}</p>
}