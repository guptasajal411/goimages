import { Queue } from "bullmq"
import redis from "../config/redisConn.js"

const photoQueue = new Queue("photoQueue");

export default photoQueue;