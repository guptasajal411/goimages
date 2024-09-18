"use client";

import RegisterAction from "@/actions/authActions";
import SubmitButton from "@/components/SubmitButton";
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast";

let initialState = { isError: false, message: "" }

export default function RegisterForm() {
    const [state, formAction] = useActionState(RegisterAction, initialState);
    useEffect(() => {
        if (state.actionResponse) {
            state.isError ? toast.error(state.message) : toast.success(state.message)
        }
    }, [state])
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