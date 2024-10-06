import "server-only";
import * as jose from "jose"
import { cookies } from "next/headers";
import Photo from "@/models/Photo";
import ThumbnailImage from "@/components/homepage/components/ThumbnailImage";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default async function Favourites() {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    let renderPhotos = [];
    try {
        const payload = jose.decodeJwt(cookie.value)
        const photos = await Photo.find({ user: payload?._id, favourite: true }).sort("-createTime").select("s3ObjectKey width height favourite").exec()
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
            : <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Start by starring a photo</p>}
    </div>
}