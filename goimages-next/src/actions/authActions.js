"use server";

import dbConn from "@/config/dbConn";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function RegisterAction(prevState, formData) {
    await dbConn();
    try {
        let name = formData.get("name");
        let email = formData.get("email");
        let password = formData.get("password");
        const foundUser = await User.findOne({ email }).exec();
        if (foundUser) {
            cookies().delete(process.env.AUTH_COOKIE_NAME)
            return { isError: true, message: "Email is already registered", actionResponse: true }
        }
        const user = await User.create({ name, email, password });
        const token = await user.generateToken();
        cookies().set(process.env.AUTH_COOKIE_NAME, token, { maxAge: 48 * 60 * 60, httpOnly: true });
        return { isError: false, message: "User registered", actionResponse: true, redirect: "/", data: { email: user.email, name: user.name } }
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
        cookies().set(process.env.AUTH_COOKIE_NAME, token, { maxAge: 48 * 60 * 60, httpOnly: true });
        return { isError: false, message: "Logged in successfully", actionResponse: true, redirect: "/", data: { email: foundUser.email, name: foundUser.name } }
    } catch (e) {
        console.log(e.message);
        return { isError: true, message: "An error occoured", actionResponse: true }
    }
}

export async function LogoutAction() {
    cookies().delete(process.env.AUTH_COOKIE_NAME);
    return { isError: false, message: "Logged out sucessfully", actionResponse: true, redirect: "/" }
}