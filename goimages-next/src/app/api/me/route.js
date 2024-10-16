import "server-only"
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as jose from "jose"
import dbConn from "@/config/dbConn";
import Album from "@/models/Album";

export async function GET() {
    let authenticated = false;
    let user;
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    if (cookie?.value) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jose.jwtVerify(cookie.value, secret, {});
            await dbConn();
            const foundUser = await User.findOne({ email: payload.email }).select("name email createdAt").exec();
            if (foundUser) {
                const query = { $or: [{ user: foundUser._id }, { $and: [{ sharedWith: foundUser._id }, { accessibility: 'add-images' }, { privacy: 'shared' }] }] }
                const albums = await Album.find(query).select("title").exec();
                authenticated = true;
                user = foundUser.toObject();
                return NextResponse.json({
                    success: true, data: {
                        userData: { authenticated: true, name: user.name, email: user.email, token: await foundUser.generateToken() }, albumData: albums
                    }
                });
            }
        } catch (e) {
            console.log(e);
            return NextResponse.json({ success: false, data: { authenticated: false } });
        }
    } else {
        return NextResponse.json({ success: true, data: { authenticated: false } });
    }
    return NextResponse.json({ success: true, data: { authenticated: false }, woah: true });
}