"use client"

import { useState } from "react"
import ThumbnailImage from "./ThumbnailImage"
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getUserPhotos } from "@/actions/dashboardActions";
import { useAppDispatch } from "@/store/hooks";
import { hideCreateNewAlbum, showCreateNewAlbum } from "@/store/slices/interfaceSlice";
import { addToAlbum, removeFromAlbum } from "@/store/slices/albumSlice";

export default function ImageGridClient({ renderPhotos, originalShowLoading, favourites = false }) {
    const [images, setImages] = useState(renderPhotos);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showLoading, setShowLoading] = useState(originalShowLoading);
    const [page, setPage] = useState(0);
    const { ref, inView } = useInView();
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function getPhotos() {
            const response = await getUserPhotos(page + 1, undefined, favourites);
            if (response.success) {
                setImages(images => [...images, ...response.data]);
                setShowLoading(response?.showLoading);
                setPage(page => page + 1)
            } else {
                toast.error(response?.message)
            }
        }
        if (inView) {
            getPhotos();
        }
    }, [inView]);

    useEffect(() => { setImages([...renderPhotos]) }, [renderPhotos])

    useEffect(() => { selectedImages.length > 0 ? dispatch(showCreateNewAlbum()) : dispatch(hideCreateNewAlbum()) }, [selectedImages])

    const addToSelected = (photoId, src, width, height) => { setSelectedImages(selectedImages => [...selectedImages, photoId]); dispatch(addToAlbum({ photoId, src, width, height })) }
    const removeFromSelected = (photoId) => { setSelectedImages(selectedImages => selectedImages.filter(id => id !== photoId)); dispatch(removeFromAlbum(photoId)) }

    return <>
        <div className="pt-4 flex flex-wrap gap-4">
            {images.length > 0 ? images.map(x => <ThumbnailImage src={x?.src} key={x?._id} width={x?.width} height={x?.height} id={x?.id} favourite={x?.favourite} addToSelected={addToSelected} removeFromSelected={removeFromSelected} isSelected={selectedImages.includes(x?._id)} />) : <p className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Start by uploading your photos</p>}
        </div>
        {showLoading && <p ref={ref} className="text-tirtiary mx-auto text-center mt-20 animate-fade-in">Loading...</p>}
    </>
}