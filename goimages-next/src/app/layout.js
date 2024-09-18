import "server-only"
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
                <div>{children}</div>
            </body>
        </html>
    );
}
