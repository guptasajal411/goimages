import "server-only"
import getUserIP from "./getUserIP";

export default async function verifyCloudflareTurnstile(cfTurnstileResponse) {
    const ip = getUserIP();
    if (!ip) throw new Error("IP Address not found")
    let cfFormData = new FormData();
    cfFormData.append("secret", process.env.CF_SECRET_KEY);
    cfFormData.append("response", cfTurnstileResponse);
    cfFormData.append("remoteip", ip);
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        body: cfFormData,
        method: "POST"
    });
    const outcome = await result.json();
    if (!outcome.success) throw new Error("Cloudflare verification error")
    return outcome;
}