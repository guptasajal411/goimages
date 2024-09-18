"use client";

import { useFormStatus } from "react-dom"

export default function SubmitButton({ content }) {
    const { pending } = useFormStatus();
    return <button disabled={pending} type="submit">{pending ? "Submitting" : content}</button>
}