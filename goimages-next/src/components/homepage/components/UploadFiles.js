"use client"

import { revalidatePathAction } from "@/actions/utilActions";
import { useAppSelector } from "@/store/hooks";
import { logoutUser, setUser } from "@/store/slices/userSlice";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function UploadFiles() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const user = useAppSelector(state => state.userReducer)
    const interfaceValue = useAppSelector(state => state.interfaceReducer)
    const dispatch = useDispatch();
    const inputRef = useRef();
    const dialogRef = useRef(null);

    function handleFileChange(e) {
        setSelectedFiles(e.target.files);
    }

    function toggleDialog() {
        if (dialogRef.current) {
            dialogRef.current.hasAttribute("open") ? dialogRef.current.close() : dialogRef.current.showModal()
        }
    }

    useEffect(() => {
        async function getUserData() {
            const _response = await fetch("/api/me", { credentials: "include", cache: "no-store" });
            const response = await _response.json();
            if (response.success && response?.data?.authenticated) {
                dispatch(setUser(response?.data))
            } else {
                dispatch(logoutUser())
            }
        }
        getUserData();
    }, [])

    async function handleUpload(e) {
        e.preventDefault();
        setIsUploading(true);
        try {
            const formData = new FormData();
            Array.from(selectedFiles).forEach(x => formData.append("files", x));
            const _response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
                method: "POST", body: formData, credentials: "include", headers: { Authorization: `Bearer ${user?.userInfo?.token}` }
            });
            const response = await _response.json();
            response?.success ? toast.success(response.message) : toast.error(response.message);
            setIsUploading(false);
            setSelectedFiles([]);
            inputRef.current.value = ""
            revalidatePathAction("/");
        } catch (e) {
            console.log(e);
            setIsUploading(false);
            toast.error("An error occoured")
        }
    }

    return interfaceValue.showCreateNewAlbum
        ? <><div className={`w-fit flex justify-center items-center`}>
            <div onClick={() => toggleDialog()} className="bg-lime-400 bg-opacity-10 hover:bg-opacity-15 transition-all ease-in-out duration-200 text-center text-primary py-2 px-2 rounded-md border-lime-500/100 border flex justify-center items-center gap-2 text-base cursor-pointer select-none">
                Add to album
            </div>
        </div>
            <dialog ref={dialogRef} className="w-[400px] max-w-[calc(100vw-30px)] rounded-md bg-background border border-lime-400">
                <div className="px-2 py-3 w-full">
                    <div className="px-0 w-full relative">
                        <p className="text-2xl text-center text-primary">Add to album</p>
                        <Image src={"/back.svg"} width={36} height={36} onClick={() => toggleDialog()} className="absolute top-3 left-2 cursor-pointer opacity-70" />
                    </div>
                </div>
                <div className="w-full flex-col items-start justify-center pb-2">
                    <Link href={"/albums/new"} className="px-4 py-4 w-full flex justify-start items-center gap-3 cursor-pointer transition-all ease-in-out duration-200 hover:bg-lime-800 hover:bg-opacity-10">
                        <Image src={"/add.svg"} width={32} height={32} />
                        <p className="text-md text-primary">Create new album</p>
                    </Link>
                </div>
            </dialog></>
        : <form onSubmit={async e => await handleUpload(e)} className="flex">
            <div className={`w-fit flex justify-center items-center ${selectedFiles.length > 0 && "me-2"}`}>
                <label htmlFor="imageUploadInput" className="text-primary px-3 py-2 border border-lime-400 border-dashed cursor-pointer">
                    <p className="m-0 text-primary text-base">{selectedFiles.length > 0 ? <>{selectedFiles.length} file{selectedFiles.length > 1 && <>s</>} selected</> : <>Upload Files</>}</p>
                </label>
                <input id="imageUploadInput" ref={inputRef} type="file" hidden multiple accept="image/*" onChange={e => handleFileChange(e)} />
            </div>
            {selectedFiles.length > 0 && <button type="submit" className="border-2 border-black px-2 py-2 text-primary border-primary" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>}
        </form>
}