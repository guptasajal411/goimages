import "server-only"
import Home from "./home";
import { cookies } from "next/headers";
import Dashboard from "./dashboard";
import ReduxExample from "@/components/home/ReduxExample";
import User from "@/models/User";
import dbConn from "@/config/dbConn";
import * as jose from "jose"

export default async function Page() {
    let authenticated = false;
    let user;
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    if (cookie) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jose.jwtVerify(cookie.value, secret, {});
            await dbConn();
            const foundUser = await User.findOne({ email: payload.email }).exec();
            if (foundUser) authenticated = true; user = foundUser.toObject();
        } catch (e) {
            console.log(e)
            authenticated = false;
        }
    } else {
        authenticated = false;
    }
    return (
        <div>
            <p>hello</p>
            {authenticated ? <Dashboard userData={{ email: user.email, name: user.name }} /> : <Home />}
            <ReduxExample />
        </div>
    );
}
