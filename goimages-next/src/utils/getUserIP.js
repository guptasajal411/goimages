import "server-only"
import { headers } from "next/headers";

export default function getUserIP() {
    let forwardedFor = headers().get("x-forwarded-for")
    let realIp = headers().get("x-real-ip");
    if (forwardedFor) return forwardedFor.split(",")[0].trim()
    if (realIp) return realIp.trim();
    throw new Error("IP Address not found")
}