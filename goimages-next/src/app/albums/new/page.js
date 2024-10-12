"use client"
// this page is intentionally a client component, to test some inefficiencies that occoured, though some parts of this page can be shifted to a server component

import { createAlbumAction } from "@/actions/albumActions";
import ThumbnailImage from "@/components/homepage/components/ThumbnailImage";
import SubmitButton from "@/components/SubmitButton";
import { useAppSelector } from "@/store/hooks"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useActionState, useEffect } from "react";
import toast from "react-hot-toast";

let initialState = { success: false, message: "" }

export default function Page() {
    const album = useAppSelector(store => store.albumReducer);
    const router = useRouter();
    const [privacy, setPrivacy] = useState("private");
    const [accessibility, setAccessibility] = useState("view-only");
    const [state, formAction] = useActionState(createAlbumAction, initialState);

    useEffect(() => {
        if (state.actionResponse) {
            if (state.success) {
                toast.success(state.message);
                router.push(state.redirect);
            } else {
                toast.error(state.message);
                setPrivacy("private");
                setAccessibility("view-only");
            }
        }
    }, [state])

    return <div className="w-full max-w-[1536px] mx-auto p-4">
        <form action={formAction} className="sm:ps-12 mt-8 flex flex-col items-start w-full">
            <p className="text-primary text-xl">Create new album</p>
            <input autoFocus required className="text-primary text-md bg-transparent border border-b-lime-400 border-x-transparent border-t-transparent mt-10" placeholder="Title" name="title" />
            {album?.selectedPhotosForAlbum.length > 0 ? <>
                <div className="max-w-full w-full flex flex-wrap items-center mt-12 gap-4">
                    {album?.selectedPhotosForAlbum.map(photo => <ThumbnailImage width={photo.width} height={photo.height} src={photo.src} imageOnly={true} id={photo.photoId} />)}
                </div>
                <input hidden value={JSON.stringify(album?.selectedPhotosForAlbum)} name="photos" />
                <div className="flex flex-col mt-12 animate-fade-in-down">
                    <div className="flex w-full max-w-full">
                        <p className="text-md text-primary">Privacy: </p>
                        <div className="ps-8">
                            <input type="radio" name="privacy" value="private" id="private" checked={privacy === "private"} onChange={e => setPrivacy(e.target.value)} hidden className="peer" />
                            <label for="private" className="text-primary text-md ms-2 cursor-pointer bg-lime-400 bg-opacity-10 px-3 py-2 rounded-md peer-checked:border-lime-400 peer-checked:bg-opacity-15 peer-checked:border transition-all duration-300">Private</label>
                        </div>
                        <div className="ps-8">
                            <input type="radio" name="privacy" value="shared" id="shared" checked={privacy === "shared"} onChange={e => setPrivacy(e.target.value)} hidden className="peer" />
                            <label for="shared" className="text-primary text-md ms-2 cursor-pointer bg-lime-400 bg-opacity-10 px-3 py-2 rounded-md peer-checked:border-lime-400 peer-checked:bg-opacity-15 peer-checked:border transition-all duration-300">Shared</label>
                        </div>
                        <div className="ps-8">
                            <input type="radio" name="privacy" value="public" id="public" checked={privacy === "public"} onChange={e => setPrivacy(e.target.value)} className="peer" hidden />
                            <label for="public" className="text-primary text-md ms-2 cursor-pointer bg-lime-400 bg-opacity-10 px-3 py-2 rounded-md peer-checked:border-lime-400 peer-checked:bg-opacity-15 peer-checked:border transition-all duration-300">Public</label>
                        </div>
                    </div>
                    {(privacy === "shared" || privacy === "public") && <div className="flex flex-col w-full max-w-full animate-fade-in-down">
                        {privacy === "shared" && <div className="w-full flex animate-fade-in-down">
                            <textarea required className="text-primary text-md bg-transparent border border-b-lime-400 border-x-transparent border-t-transparent mt-10 w-full" rows={3} placeholder="Enter email addresses (one per line)" name="emails" />
                        </div>}
                        <div className="w-full flex mt-10">
                            <p className="text-md text-primary">Accessibility: </p>
                            <div className="ps-8">
                                <input type="radio" name="accessibility" value="view-only" id="view-only" checked={accessibility === "view-only"} onChange={e => setAccessibility(e.target.value)} hidden className="peer" />
                                <label for="view-only" className="text-primary text-md ms-2 cursor-pointer bg-lime-400 bg-opacity-10 px-3 py-2 rounded-md peer-checked:border-lime-400 peer-checked:bg-opacity-15 peer-checked:border transition-all duration-300">View Only</label>
                            </div>
                            {privacy === "shared" && <div className="ps-8">
                                <input type="radio" name="accessibility" value="add-images" id="add-images" checked={accessibility === "add-images"} onChange={e => setAccessibility(e.target.value)} hidden className="peer" />
                                <label for="add-images" className="text-primary text-md ms-2 cursor-pointer bg-lime-400 bg-opacity-10 px-3 py-2 rounded-md peer-checked:border-lime-400 peer-checked:bg-opacity-15 peer-checked:border transition-all duration-300">Add Images</label>
                            </div>}
                        </div>
                    </div>}
                </div>
                <div className="mt-12 animate-fade-in-down">
                    <SubmitButton content={"Create album"} className="w-full text-center bg-lime-400 bg-opacity-10 hover:bg-opacity-15 transition-all ease-in-out duration-200 rounded-md border-lime-500/100 border py-2 text-primary sm:order-2 order-1 px-3 text-md" />
                </div>
            </> : <p className="text-tirtiary animate-fade-in-down mt-16">Select photos from <Link href={"/"}>homepage<Image className="inline opacity-50" width={16} height={16} src={"/open.svg"} /></Link> to get started</p>}
        </form>
    </div>
}