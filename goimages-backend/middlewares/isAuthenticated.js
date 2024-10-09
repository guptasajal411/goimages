import * as jose from "jose"
import User from "../models/User.js";

export default async function isAuthenticated(req, res, next) {
    const cookie = req.cookies[process.env.AUTH_COOKIE_NAME];
    if (!cookie) {
        return res.status(401).json({ success: false, message: "unauthorised", devMessage: "cookie not found" })
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(cookie, secret, {});
        const foundUser = await User.findOne({ email: payload?.email }).exec();
        if (!foundUser) throw new Error("user not found in db with email: " + payload?.email)
        req.user = { name: foundUser.name, email: foundUser.email, _id: foundUser._id };
        next();
    } catch (e) {
        console.log(e)
        return res.status(401).json({ success: false, message: "unauthorised", devMessage: "an error occoured" })
    }
}