import "server-only"
import { cookies } from "next/headers"
import * as jose from "jose"
import Photo from "@/models/Photo";
import AWS from "aws-sdk";
import Image from "next/image";
import ThumbnailImage from "./ThumbnailImage";

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
        const photos = await Photo.find({ user: payload?._id }).sort("-createTime").select("s3ObjectKey width height favourite").exec()
        for (const photo of photos) {
            const signedUrl = s3.getSignedUrl("getObject", {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: photo?.s3ObjectKey,
                Expires: 60 * 60
            });
            renderPhotos.push({ src: signedUrl, _id: photo?._id, height: photo?.height, width: photo?.width, id: photo?._id.toString(), favourite: photo?.favourite })
        }
    } catch (e) {
        console.log(e);
        return <p className="text">An error occoured</p>
    }
    return <div className="w-[100%] max-w-[1536px] mx-auto pt-4 flex flex-wrap gap-4">
        {renderPhotos.length > 0
            ? renderPhotos.map(x => <ThumbnailImage src={x?.src} key={x?._id} width={x?.width} height={x?.height} id={x?.id} favourite={x?.favourite} />)
            : <p className="text-tirtiary mx-auto text-center mt-32 animate-fade-in">Start by uploading your photos</p>}
    </div>
}