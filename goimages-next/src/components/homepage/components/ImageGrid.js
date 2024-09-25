import { cookies } from "next/headers"
import "server-only"
import * as jose from "jose"
import Photo from "@/models/Photo";
import AWS from "aws-sdk";
import Image from "next/image";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default async function ImageGrid() {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    let renderPhotos = [];
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(cookie.value, secret, {});
        const photos = await Photo.find({ user: payload?._id }).sort("-createdAt").select("s3ObjectKey").exec()
        for (const photo of photos) {
            const signedUrl = s3.getSignedUrl("getObject", {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: photo?.s3ObjectKey,
                Expires: 60 * 60
            });
            renderPhotos.push({ src: signedUrl, _id: photo?._id })
        }
    } catch (e) {
        console.log(e);
        return <p className="text">An error occoured</p>
    }
    return <div className="w-[100%] pt-4 flex flex-wrap gap-4">
        {renderPhotos.length > 0
            ? renderPhotos.map(x => <div className="h-[200px] rounded">
                <Image src={x?.src} key={x?._id} blurDataURL="/favicon.png" className="rounded h-[100%] w-auto object-cover" width={200} height={200} />
            </div>)
            : <p className="text">No images found</p>}
    </div>
}