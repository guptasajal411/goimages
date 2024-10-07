import "server-only"
import { cookies } from "next/headers"
import * as jose from "jose"
import Photo from "@/models/Photo";
import AWS from "aws-sdk";
import ThumbnailImage from "./ThumbnailImage";
import { getUserPhotos } from "@/actions/dashboardActions";
import ImageGridClient from "./ImageGridClient";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export default async function ImageGrid() {
    let renderPhotos = [];
    let showLoading = false;
    const response = await getUserPhotos(0, 10);
    if (response.success) {
        renderPhotos = response.data;
        showLoading = response.showLoading
    } else return <div className="w-[100%] max-w-[1536px] mx-auto pt-4 flex flex-wrap gap-4"><p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">An error occoured</p></div>
    return <div className="w-[100%] max-w-[1536px] mx-auto">
        <ImageGridClient renderPhotos={renderPhotos} originalShowLoading={showLoading} />
    </div>
}