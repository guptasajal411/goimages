import { Redis } from "ioredis";

class RedisClient {
    static instance;
    constructor() { }

    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis(process.env.REDIS_URL);
            RedisClient.instance.on("error", (error) => console.log("redis connection error: " + error));
            RedisClient.instance.on("connect", () => console.log("redis connection established"));
        }
        return RedisClient.instance;
    }

    static quit() {
        if (RedisClient.instance) {
            RedisClient.instance.quit();
        }
    }
}

export default RedisClient;