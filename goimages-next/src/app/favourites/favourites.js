import "server-only";

import { getUserPhotos } from "@/actions/dashboardActions";
import ImageGridClient from "@/components/homepage/components/ImageGridClient";

export default async function Favourites() {
    let renderPhotos = [];
    let showLoading = false;
    const response = await getUserPhotos(0, undefined, true);
    if (response.success) {
        renderPhotos = response.data;
        showLoading = response.showLoading
    } else return <div className="w-[100%] max-w-[1536px] mx-auto pt-4 flex flex-wrap gap-4"><p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">An error occoured</p></div>
    return <div className="w-[100%] max-w-[1536px] mx-auto">
        <ImageGridClient renderPhotos={renderPhotos} originalShowLoading={showLoading} favourites={true} />
    </div>
}