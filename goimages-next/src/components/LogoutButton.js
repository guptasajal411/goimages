"use client"

import { LogoutAction } from "@/actions/authActions"

export default function LogoutButton() {
    return <form action={LogoutAction}>
        <button type="submit">Logout</button>
    </form>
}