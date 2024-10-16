import "server-only"
import Image from "next/image"
import Link from "next/link"
import UploadFiles from "./UploadFiles";

export default async function TopBar({ route }) {
    const routes = [{ route: "/", image: "/photo.svg", content: "Photos" },
    { route: "/favourites", image: "/star.svg", content: "Favourites" },
    { route: "/albums", image: "/album.svg", content: "Albums" }];
    const activeStyle = "bg-lime-200 border-lime-500/100 border bg-opacity-30 hover:bg-opacity-40 text-primary";
    const inactiveStyle = "bg-lime-400 border-tirtiary border bg-opacity-10 hover:bg-opacity-15 text-primary";
    if (routes.some((r) => r.route === route)) {
        return <div className="flex gap-2 max-w-[1400px] overflow-x-auto scrollbar border border-t-0 border-tirtiary opacity-60 rounded-b-md mx-auto px-3 py-1 justify-between">
            <div className="flex gap-2">
                {routes.map(x => <Link className={`w-fit text-center transition-all ease-in-out duration-200 rounded-md py-2 px-3 flex justify-center items-center gap-1 ${x.route === route ? activeStyle : inactiveStyle}`} href={x.route} alt={x.content}>
                    <Image className="" src={x.image} width="18" height="18" alt={x.content} />
                    <>{x.content}</>
                </Link>)}
            </div>
            <UploadFiles />
        </div>
    } else {
        return null;
    }
}