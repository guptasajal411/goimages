import "server-only"
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
    title: "GoImages",
    description: "Organise and Backup Your Photos"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`antialiased`}
            >
                <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
                <nav className="w-[100vw] h-[90px] bg-red-500 flex flex-row px-4 justify-between items-center">
                    <Link href="/" className="text-2xl">GoImages</Link>
                    <div className="text-base"><LogoutButton /></div>
                </nav>
                <div>{children}</div>
            </body>
        </html>
    );
}
