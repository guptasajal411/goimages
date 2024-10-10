"use server";

import "server-only"
import dbConn from "@/config/dbConn";
import User from "@/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyCloudflareTurnstile from "@/utils/verifyCloudflareTurnstile";

export async function RegisterAction(prevState, formData) {
    await dbConn();
    try {
        let name = formData.get("name");
        let email = formData.get("email");
        let password = formData.get("password");
        let cfTurnstileResponse = formData.get("cf-turnstile-response");
        if (!cfTurnstileResponse) return { isError: true, message: "Cloudflare Error", actionResponse: true };
        try {
            await verifyCloudflareTurnstile(cfTurnstileResponse);
        } catch (e) {
            console.log(e);
            return { isError: true, message: e, actionResponse: true };
        }
        const foundUser = await User.findOne({ email }).exec();
        if (foundUser) {
            cookies().delete(process.env.AUTH_COOKIE_NAME)
            return { isError: true, message: "Email is already registered", actionResponse: true }
        }
        const user = await User.create({ name, email, password });
        const token = await user.generateToken();
        cookies().set(process.env.AUTH_COOKIE_NAME, token, { maxAge: 48 * 60 * 60, httpOnly: true, sameSite: process.env.NEXT_PUBLIC_NODE_ENV === "production" && "none", secure: process.env.NEXT_PUBLIC_NODE_ENV === "production" && true });
        return { isError: false, message: "User registered", actionResponse: true, redirect: "/", data: { email: user.email, name: user.name, token } }
    } catch (e) {
        console.log(e.message);
        return { isError: true, message: "An error occoured", actionResponse: true }
    }
}

export async function LoginAction(prevState, formData) {
    await dbConn();
    try {
        let email = formData.get("email");
        let password = formData.get("password");
        let cfTurnstileResponse = formData.get("cf-turnstile-response");
        if (!cfTurnstileResponse) return { isError: true, message: "Cloudflare Error", actionResponse: true };
        try {
            await verifyCloudflareTurnstile(cfTurnstileResponse);
        } catch (e) {
            console.log(e.message);
            return { isError: true, message: e.message, actionResponse: true };
        }
        const foundUser = await User.findOne({ email }).exec();
        if (!foundUser) {
            cookies().delete(process.env.AUTH_COOKIE_NAME)
            return { isError: true, message: "User not found", actionResponse: true }
        }
        const isPasswordCorrect = await foundUser.comparePassword(password);
        if (!isPasswordCorrect) {
            cookies().delete(process.env.AUTH_COOKIE_NAME)
            return { isError: true, message: "Wrong password", actionResponse: true }
        }
        const token = await foundUser.generateToken();
        cookies().set(process.env.AUTH_COOKIE_NAME, token, { maxAge: 48 * 60 * 60, httpOnly: true, sameSite: process.env.NEXT_PUBLIC_NODE_ENV === "production" && "none", secure: process.env.NEXT_PUBLIC_NODE_ENV === "production" && true });
        return { isError: false, message: "Logged in successfully", actionResponse: true, redirect: "/", data: { email: foundUser.email, name: foundUser.name, token } }
    } catch (e) {
        console.log(e.message);
        return { isError: true, message: "An error occoured", actionResponse: true }
    }
}

export async function LogoutAction() {
    cookies().delete(process.env.AUTH_COOKIE_NAME);
    redirect("/")
    return { isError: false, message: "Logged out sucessfully", actionResponse: true, redirect: "/" }
}