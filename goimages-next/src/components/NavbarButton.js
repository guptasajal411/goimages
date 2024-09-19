"use client"

import { LogoutAction } from "@/actions/authActions"
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function NavbarButton() {
    const userData = useAppSelector(state => state.userReducer);
    return <>
        {userData.authenticated ? <form action={LogoutAction}>
            <button type="submit">Logout</button>
        </form> : <Link href="/login">Login</Link>}
    </>
}