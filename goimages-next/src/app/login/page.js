import "server-only";
import LoginForm from "./form";

export default async function Page() {
    return <div className="min-w-[100vw] min-h-[100vh] bg-slate-500 flex flex-row justify-center items-center">
        <div className="max-w-[400px] border max-h-[60vh] min-w-[30%] bg-green-300">
            <p className="text-2xl">Login</p>
            <LoginForm />
        </div>
    </div>
}