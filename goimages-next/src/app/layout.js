import "server-only"

import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import NavbarButton from "@/components/NavbarButton";
import StoreProvider from "@/store/StoreProvider";
import { ptSans } from "@/components/fonts/fonts";
import Image from "next/image";
import { cookies } from "next/headers";
import * as jose from "jose"

export const metadata = {
    title: "GoImages",
    description: "Organise and Backup Your Photos"
};

export default async function RootLayout({ children }) {
    let authenticated = false;
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(cookie.value, secret, {});
        if (payload) authenticated = true;
    } catch (e) {
        console.log
        authenticated = false;
    }
    return (
        <html lang="en">
            <body
                className={`antialiased dark bg-background ${ptSans.className}`}
            >
                <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
                <StoreProvider>
                    <nav className="w-[100%] h-[90px] bg-background border-b-zinc-500 border border-x-0 border-t-0 px-4 ">
                        <div className="flex flex-row w-full h-full m-auto max-w-[1500px] justify-between items-center">
                            <Link href="/" aria-label="GoImages Homepage" className="text-2xl text-primary"><Image src="/logo.svg" width="250" height="50" alt="GoImages Homepage" /></Link>
                            <div className="text-base"><NavbarButton authenticated={authenticated} /></div>
                        </div>
                    </nav>
                    <div>{children}</div>
                </StoreProvider>
            </body>
        </html>
    );
}
