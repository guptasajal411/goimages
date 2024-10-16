import "server-only"
import TopBar from "@/components/homepage/components/TopBar";
import { Suspense } from "react";
import AlbumId from "@/components/albums/AlbumId";

export default async function Page({ params }) {
    if (!params.albumId) return <div className="p-4 pt-0">
        <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Album not found</p>
    </div>
    return <div className="p-4 pt-0">
        <TopBar route="/albums" />
        <div className="w-[100%] max-w-[1536px] mx-auto">
            <Suspense fallback={<p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Loading...</p>}>
                <AlbumId albumId={params.albumId} />
            </Suspense>
        </div>
    </div>
}