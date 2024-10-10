"use client";

import { RegisterAction } from "@/actions/authActions";
import SubmitButton from "@/components/SubmitButton";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast";
import Turnstile, { useTurnstile } from "react-turnstile";

let initialState = { isError: false, message: "" }

export default function RegisterForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const turnstile = useTurnstile();
    const [state, formAction] = useActionState(RegisterAction, initialState);
    useEffect(() => {
        if (state.actionResponse) {
            state.isError ? toast.error(state.message) : toast.success(state.message);
            state.data && dispatch(setUser(state.data));
            state.redirect && router.replace(state.redirect);
        }
    }, [state])
    return <form className="text-md flex flex-col items-center justify-center w-full mt-8 px-4 sm:mb-0 mb-12" action={formAction}>
        <div className="w-full mt-3">
            <input name="name" placeholder="Name" required type="text" className="mt-3 placeholder:text-tirtiary border-b-tirtiary border border-x-0 border-t-0 w-full text-secondary transition-all duration-1500 ease-in-out bg-background" />
        </div>
        <div className="w-full mt-3">
            <input name="email" placeholder="Email" required type="email" className="mt-3 placeholder:text-tirtiary border-b-tirtiary border border-x-0 border-t-0 w-full text-secondary transition-all duration-1500 ease-in-out bg-background" />
        </div>
        <div className="w-full mt-3">
            <input name="password" placeholder="Password" required type="password" className="mt-3 placeholder:text-tirtiary border-b-tirtiary border border-x-0 border-t-0 w-full text-secondary transition-all duration-1500 ease-in-out bg-background" />
        </div>
        <div className="w-full mt-3">
            <Turnstile
                sitekey={process.env.NEXT_PUBLIC_CF_SITE_KEY}
                theme="dark"
                size="flexible" />
        </div>
        <div className="flex sm:flex-row flex-col gap-4 items-center justify-center w-full mt-12">
            <Link href="/login" aria-label="Login" className="w-full text-center py-2 text-secondary border-tirtiary border rounded-md sm:order-1 order-2">Login</Link>
            <SubmitButton content={"Register"} className="w-full text-center bg-lime-400 bg-opacity-10 hover:bg-opacity-15 transition-all ease-in-out duration-200 rounded-md border-lime-500/100 border py-2 text-primary sm:order-2 order-1" />
        </div>
    </form>
}