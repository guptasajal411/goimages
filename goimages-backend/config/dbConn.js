import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConn() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        mongoose.set("strictQuery", true);
        cached.promise = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongoDB!");
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConn;
