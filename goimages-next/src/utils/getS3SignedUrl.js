import "server-only"
import AWS from "aws-sdk"

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default function getS3SignedUrl(s3ObjectKey, duration = 60 * 60) {
    try {
        const signedUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3ObjectKey,
            Expires: duration
        });
        return signedUrl
    } catch (e) {
        console.log(e.message);
        return null;
    }
}