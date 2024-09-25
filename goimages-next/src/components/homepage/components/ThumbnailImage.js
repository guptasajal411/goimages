"use client"

import Image from "next/image"
import { useState } from "react"

export default function ThumbnailImage({ src, key }) {
    const [isLoaded, setIsLoaded] = useState(false);
    return <Image src={src} key={key} className={`rounded h-[100%] w-auto object-cover transition-opacity duration-1000 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`} unoptimized width={200} height={200} onLoad={() => setIsLoaded(true)} />
}