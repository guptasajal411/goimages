"use client";

import { RegisterAction } from "@/actions/authActions";
import SubmitButton from "@/components/SubmitButton";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast";

let initialState = { isError: false, message: "" }

export default function RegisterForm() {
    const dispatch = useAppDispatch();
    const [state, formAction] = useActionState(RegisterAction, initialState);
    useEffect(() => {
        if (state.actionResponse) {
            state.isError ? toast.error(state.message) : toast.success(state.message);
            state.data && dispatch(setUser(state.data));
            state.redirect && router.replace(state.redirect);
        }
    }, [state])
    return <form className="text-lg" action={formAction}>
        <div>
            <input name="name" placeholder="name" required type="text" />
        </div>
        <div>
            <input name="email" placeholder="email" required type="email" />
        </div>
        <div>
            <input name="password" placeholder="password" required type="password" />
        </div>
        <SubmitButton content={"Register"} />
    </form>
}