import "server-only"
import { getUserAlbums } from "@/actions/albumActions"
import TopBar from "@/components/homepage/components/TopBar";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
    const actionResponse = await getUserAlbums();
    if (!actionResponse?.success) return <div className="p-4 pt-0">
        <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">An error occoured</p>
    </div>
    const albums = actionResponse?.data
    return <div className="p-4 pt-0">
        <TopBar route="/albums" />
        <div className="w-[100%] max-w-[1536px] mx-auto">
            {albums.length > 0 ? <div className="mt-2">
                <p className="text-primary text-xl animate-fade-in">Your albums</p>
                <div className="flex flex-col w-full space-y-4 mt-6">
                    {albums.map(album => <div className="flex animate-fade-in-down">
                        <Link href={`/albums/${album?._id}`} className="text-primary text-base pe-2">{album?.title}</Link>
                        <Image src={"/next.svg"} width={16} height={16} />
                    </div>)}
                </div>
            </div> : <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">No albums yet.</p>}
        </div>
    </div>
}