import "server-only"
import { getUserAlbumById } from "@/actions/albumActions"
import ThumbnailImage from "@/components/homepage/components/ThumbnailImage";

export default async function AlbumId({ albumId }) {
    const album = await getUserAlbumById(albumId);
    if (!album.success) return <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">{album.message}</p>
    return <>
        <p className="text-primary text-xl animate-fade-in">{album.data.title}</p>
        <div className="pt-4 flex flex-wrap gap-4">
            {album.data.photoArray.map(x => <ThumbnailImage src={x?.src} width={x?.width} height={x?.height} imageOnly={true} />)}
        </div>
    </>
}