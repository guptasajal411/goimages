import { Redis } from "ioredis";

const redis = new Redis({
    connectionName: "goimages backend connection",
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redis.on("error", (error) => console.log("redis connection error: " + error));
redis.on("connect", () => console.log("redis connection established"))

export default redis;