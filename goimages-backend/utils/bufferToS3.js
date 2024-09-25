import sharp from "sharp";
import AWS from "aws-sdk"
import dbConn from "../config/dbConn.js"
import Photo from "../models/Photo.js";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
dbConn();

export default async function bufferToS3(buffer, userId, photoId, fileFormat) {
    try {
        // const sharpBuffer = await sharp(buffer).jpeg({ quality: 100 }).toBuffer();
        const file = await s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${userId}/${photoId}.${fileFormat}`,
            Body: buffer,
            ContentType: "image/jpeg"
        }).promise();
        return { success: true, s3ObjectKey: `${userId}/${photoId}.${fileFormat}` }
    } catch (e) {
        console.log(e)
        return { success: false }
    }
}