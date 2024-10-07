import "server-only";
import * as jose from "jose"
import { cookies } from "next/headers";
import Photo from "@/models/Photo";
import ThumbnailImage from "@/components/homepage/components/ThumbnailImage";
import AWS from "aws-sdk";
import { getUserPhotos } from "@/actions/dashboardActions";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default async function Favourites() {
    let renderPhotos = []
    const response = await getUserPhotos(0, undefined, true);
    if (response.success) {
        renderPhotos = response.data
    } else return <div className="w-[100%] max-w-[1536px] mx-auto pt-4 flex flex-wrap gap-4"><p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">An error occoured</p></div>
    return <div className="w-[100%] max-w-[1536px] mx-auto pt-4 flex flex-wrap gap-4">
        {renderPhotos.length > 0
            ? renderPhotos.map(x => <ThumbnailImage src={x?.src} key={x?._id} width={x?.width} height={x?.height} id={x?.id} favourite={x?.favourite} />)
            : <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Start by starring a photo</p>}
    </div>
}