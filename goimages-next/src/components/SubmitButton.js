"use client";

import Image from "next/image";
import { useFormStatus } from "react-dom"

export default function SubmitButton({ content, className }) {
    const { pending } = useFormStatus();
    return <button disabled={pending} className={`${className} flex justify-center items-center`} type="submit">{pending ? "Submitting" : <>{content}
        <Image className="opacity-70 ms-2" src="/next.svg" width="16" height="16" alt={content} />
    </>}</button>
}