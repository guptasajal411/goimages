import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import * as jose from "jose";

const shouldntBeAccessibleIfLoggedIn = ["/login", "/register"]
const protectedRoutes = ["/dashboard"]

export default async function middleware(request) {
    const path = request.nextUrl.pathname;
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(cookie.value, secret, {});
        if (shouldntBeAccessibleIfLoggedIn.includes(path)) return NextResponse.redirect(new URL("/", request.url))
    } catch (e) {
        if (shouldntBeAccessibleIfLoggedIn.includes(path)) return NextResponse.next();
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

export const config = {
    matcher: ["/login", "/register", '/']
}