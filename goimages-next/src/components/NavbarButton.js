"use client"

import { LogoutAction } from "@/actions/authActions"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useActionState } from "react";
import HoverText from "./hoverText/HoverText";

const initialState = { isError: false, message: null }

export default function NavbarButton() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.userReducer);
    const [state, formAction] = useActionState(LogoutAction, initialState);
    return <>
        {userData.authenticated !== null && (userData.authenticated ? <form action={formAction} className="animate-fade-in">
            <button type="submit" className="text-secondary hover:underline">Logout</button>
        </form> : <div className="flex flex-row animate-fade-in">
            <Link href="/login" className="pe-3 text-secondary" aria-label="Login"><HoverText text={"Login"} /></Link>
            <Link href="/register" className="text-secondary sm:block hidden" aria-label="Register"><HoverText text={"Register"} /></Link>
        </div>)}
    </>
}