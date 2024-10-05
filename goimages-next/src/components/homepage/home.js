import "server-only";
import { useAppSelector } from "@/store/hooks"
import UpdateState from "@/components/homepage/components/UpdateState";
import Link from "next/link";
import Image from "next/image";
import { libreBaskerville } from "../fonts/fonts";

export default async function Home() {

    return <div className="p-4 bg-background h-[calc(100vh-90px)] max-h-[calc(100vh-90px)] pb-0 animate-fade-in-down">
        <UpdateState isAuthenticated={false} />
        <div className="flex sm:flex-row flex-col sm:items-center sm:mt-0 mt-32 sm:justify-center h-[calc(100%-50px)] max-w-[1500px] m-auto blurredBg relative">
            <div className="flex flex-col sm:items-start justify-center items-center basis-1/2 max-w-[600px]">
                <h1 className={`${libreBaskerville.className} block text-3xl text-primary text-center sm:text-start`}>Your Self-Hosted Photo Library</h1>
                <div className="max-w-[75%] flex flex-col">
                    <p className="text-lg text-secondary text-center sm:text-start">Free, open-source, and private photo storage, powered by your own S3 bucket</p>
                    <Link className="min-w-full bg-lime-400 bg-opacity-10 hover:bg-opacity-15 transition-all ease-in-out duration-200 text-center text-primary mt-3 py-2 px-2 rounded-md border-lime-500/100 border flex justify-center items-center gap-2" href="/register">
                        <>Get started</>
                        <Image className="opacity-70" src="/open.svg" width="16" height="16" />
                    </Link>
                </div>
            </div>
            <div className="sm:flex hidden sm:basis-1/2 flex-row items-center justify-center">
                <Image src="/hero.svg" width="400" height="400" />
            </div>
        </div>
    </div>
}