import { Worker } from "bullmq";
import AWS from "aws-sdk";
import 'dotenv/config'
import dbConn from "../config/dbConn.js";
import bufferToS3 from "../utils/bufferToS3.js";
import Photo from "../models/Photo.js";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

dbConn();

const worker = new Worker("photoQueue", async job => {
    const jobName = job.name;
    const [type, userId, photoId] = jobName.split(":");
    const fileFormat = job.data.originalname.split(".").pop();
    const buffer = Buffer.from(job.data.buffer, "base64");
    const response = await bufferToS3(buffer, userId, photoId, fileFormat);
    if (response.success) {
        const photo = await Photo.findOne({ _id: photoId }).exec();
        photo.s3ObjectKey = response?.s3ObjectKey;
        await photo.save();
    }
}, { connection: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST } });

worker.on("ready", () => console.log("photoQueueWorker is ready"))

worker.on("completed", job => {
    // console.log(job.id)
})

worker.on("failed", (job, err) => {
    console.log(err)
    console.log(job.id)
})