import "server-only"

import { LogoutAction } from "@/actions/authActions"
import Link from "next/link";
import HoverText from "./hoverText/HoverText";

export default function NavbarButton({ authenticated }) {
    return <>
        {authenticated ? <form action={LogoutAction} className="animate-fade-in">
            <button type="submit" className="text-secondary hover:underline">Logout</button>
        </form> : <div className="flex flex-row animate-fade-in">
            <Link href="/login" className="pe-3 text-secondary" aria-label="Login"><HoverText text={"Login"} /></Link>
            <Link href="/register" className="text-secondary sm:block hidden" aria-label="Register"><HoverText text={"Register"} /></Link>
        </div>}
    </>
}