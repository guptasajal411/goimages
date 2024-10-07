import "server-only"
import Home from "../components/homepage/home";
import { cookies } from "next/headers";
import Dashboard from "../components/homepage/dashboard";
import User from "@/models/User";
import dbConn from "@/config/dbConn";
import * as jose from "jose"
import redisClient from "@/config/redisConn.js";

export default async function Page() {
    let authenticated = false;
    let user;
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    if (cookie?.value) {
        try {
            const redis = redisClient.getInstance();
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jose.jwtVerify(cookie.value, secret, {});
            const cachedUser = await redis.get(`user:${payload.email}`);
            if (cachedUser) {
                user = JSON.parse(cachedUser);
                authenticated = true;
            } else {
                await dbConn();
                const foundUser = await User.findOne({ email: payload.email }).select("name email createdAt").exec();
                if (foundUser) {
                    authenticated = true;
                    user = foundUser.toObject();
                    await redis.set(`user:${payload.email}`, JSON.stringify(user), 'EX', 3600);
                }
            }
        } catch (e) {
            console.log(e);
            authenticated = false;
        }
    } else {
        authenticated = false;
    }
    return (
        <div>
            {authenticated ? <Dashboard userData={{ email: user.email, name: user.name }} /> : <Home />}
        </div>
    );
}
