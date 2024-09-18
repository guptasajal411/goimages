"use client";

import { useFormStatus } from "react-dom"

export default function SubmitButton({ content }) {
    const { isPending } = useFormStatus();
    return <button disabled={isPending} type="submit">{isPending ? "Submitting" : content}</button>
}