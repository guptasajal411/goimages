"use client";

import { useFormStatus } from "react-dom"

export default function SubmitButton({ content, className }) {
    const { pending } = useFormStatus();
    return <button disabled={pending} className={className} type="submit">{pending ? "Submitting" : content}</button>
}