"use client";

import { LoginAction } from "@/actions/authActions";
import SubmitButton from "@/components/SubmitButton";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast";

let initialState = { isError: false, message: "" }

export default function LoginForm() {
    const router = useRouter();
    const [state, formAction] = useActionState(LoginAction, initialState);
    useEffect(() => {
        if (state.actionResponse) {
            state.isError ? toast.error(state.message) : toast.success(state.message);
            state.redirect && router.replace(state.redirect);
            router
        }
    }, [state])
    return <form className="text-lg" action={formAction}>
        <div>
            <input name="email" placeholder="email" required type="email" />
        </div>
        <div>
            <input name="password" placeholder="password" required type="password" />
        </div>
        <SubmitButton content={"Login"} />
        <p>{JSON.stringify(state)}</p>
    </form>
}