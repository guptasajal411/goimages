"use client"

import { LogoutAction } from "@/actions/authActions"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/userSlice";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

const initialState = { isError: false, message: null }

export default function NavbarButton() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.userReducer);
    const [state, formAction] = useActionState(LogoutAction, initialState);
    useEffect(() => {
        if (state.actionResponse) {
            !state.isError && toast.success(state.message);
            !state.isError && dispatch(logoutUser());
        }
    }, [state])
    return <>
        {userData.authenticated ? <form action={formAction}>
            <button type="submit">Logout</button>
        </form> : <Link href="/login">Login</Link>}
    </>
}