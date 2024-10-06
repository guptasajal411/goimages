import "server-only";
import RegisterForm from "./form";
import { libreBaskerville } from "@/components/fonts/fonts";

export default async function Page() {
    return <div className="w-[100%] h-[calc(100vh-90px)] bg-background flex flex-row justify-center items-center blurredBg after:blur-[160px]">
        <div className="max-w-[450px] min-w-[300px] sm:mt-4 mt-30 animate-fade-in-down px-8">
            <h1 className={`sm:text-3xl text-2xl ${libreBaskerville.className} text-primary text-center`}>Welcome to GoImages</h1>
            <p className="text-md text-tirtiary text-center mt-8">Welcome to GoImages. Please sign up with your email and password.</p>
            <RegisterForm />
        </div>
    </div>
}