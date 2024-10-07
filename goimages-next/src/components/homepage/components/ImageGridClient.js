"use client"

import { useState } from "react"
import ThumbnailImage from "./ThumbnailImage"

export default function ImageGridClient({ renderPhotos, originalShowLoading }) {
    const [images, setImages] = useState(renderPhotos);
    const [showLoading, setShowLoading] = useState(originalShowLoading);
    return <>
        <div className="pt-4 flex flex-wrap gap-4">
            {images.length > 0 ? images.map(x => <ThumbnailImage src={x?.src} key={x?._id} width={x?.width} height={x?.height} id={x?.id} favourite={x?.favourite} />) : <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Start by uploading your photos</p>}
        </div>
        {showLoading && <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Loading...</p>}
    </>
}