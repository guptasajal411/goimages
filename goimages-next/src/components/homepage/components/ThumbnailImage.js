"use client"

import Image from "next/image"
import { useState } from "react"
import { toggleFavourite } from "@/actions/dashboardActions";
import "./thumbnailImage.css"
import toast from "react-hot-toast";

export default function ThumbnailImage({ src, key, width, height, id, favourite }) {
    const [isLoaded, setIsLoaded] = useState(false);
    return <div className="relative thumbnailContainer">
        <div width={width} height={height} className={`relative h-[200px] rounded-md bg-gray-300 transition-all duration-1000 ease-out ${isLoaded ? "bg-transparent" : "bg-gray-300 bg-opacity-20"}`}>
            <Image src={src} key={key} className={`rounded-md h-[100%] w-auto object-cover transition-opacity duration-1000 ease-in-out ${isLoaded ? "opacity-100 animate-fade-in-down" : "opacity-0"}`} unoptimized width={width} height={height} onLoad={() => setIsLoaded(true)} />
        </div>
        <form className="absolute favouriteIcon" action={async () => {
            const { success, message } = await toggleFavourite(id)
            success ? toast.success(message) : toast.error(message)
        }}>
            <button type="submit">
                <Image className="" src={favourite ? "/filledStar.svg" : "/star.svg"} width="24" height="24" alt="Favourite this image" />
            </button>
        </form>
    </div>
}