import { Worker } from "bullmq";
import AWS from "aws-sdk";
import sharp from "sharp"
import 'dotenv/config'
import Photo from "../models/Photo.js";
import dbConn from "../config/dbConn.js";

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
    const buffer = Buffer.from(job.data.buffer, "base64")
    try {
        const sharpBuffer = await sharp(buffer).jpeg({ quality: 100 }).toBuffer();
        const file = await s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${userId}/${photoId}.${fileFormat}`,
            Body: sharpBuffer,
            ContentType: "image/jpeg"
        }).promise();
        let photo = await Photo.findOne({ _id: photoId }).exec();
        photo.s3ObjectKey = `${userId}/${photoId}.${fileFormat}`;
        await photo.save();
        // const image = fs.writeFileSync(`./${job.data.originalname}`, buffer)
        // const image = sharp(buffer)
        //     .resize(null)
        //     .jpeg({ quality: 100 })
        //     .toFile(`./${job.data.originalname}`)
    } catch (e) {
        console.log(e)
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