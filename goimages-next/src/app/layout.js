import "server-only"
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import NavbarButton from "@/components/NavbarButton";
import StoreProvider from "@/store/StoreProvider";
import { ptSans } from "@/components/fonts/fonts";
import Image from "next/image";

export const metadata = {
    title: "GoImages",
    description: "Organise and Backup Your Photos"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`antialiased dark bg-background ${ptSans.className}`}
            >
                <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
                <StoreProvider>
                    <nav className="w-[100%] h-[90px] bg-background border-b-zinc-500 border border-x-0 border-t-0 px-4 ">
                        <div className="flex flex-row w-full h-full m-auto max-w-[1500px] justify-between items-center">
                            <Link href="/" className="text-2xl text-primary"><Image src="/logo.svg" width="250" height="50" /></Link>
                            <div className="text-base"><NavbarButton /></div>
                        </div>
                    </nav>
                    <div>{children}</div>
                </StoreProvider>
            </body>
        </html>
    );
}
