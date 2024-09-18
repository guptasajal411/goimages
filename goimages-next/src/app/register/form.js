"use client";

import RegisterAction from "@/actions/authActions";
import SubmitButton from "@/components/SubmitButton";
import { useActionState } from "react"

let initialState = { isError: false, message: "" }

export default function RegisterForm() {
    const [state, formAction] = useActionState(RegisterAction, initialState)
    return <form action={formAction}>
        <div>
            <input name="email" />
        </div>
        <div>
            <input name="password" />
        </div>
        <SubmitButton content={"Register"} />
        <p>{JSON.stringify(state)}</p>
    </form>
}