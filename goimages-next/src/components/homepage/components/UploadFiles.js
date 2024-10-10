"use client"

import { revalidatePathAction } from "@/actions/utilActions";
import { useAppSelector } from "@/store/hooks";
import { logoutUser, setUser } from "@/store/slices/userSlice";
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function UploadFiles() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const user = useAppSelector(state => state.userReducer)
    const dispatch = useDispatch();

    function handleFileChange(e) {
        setSelectedFiles(e.target.files);
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
            revalidatePathAction("/");
        } catch (e) {
            console.log(e);
            setIsUploading(false);
            toast.error("An error occoured")
        }
    }

    return <form onSubmit={async e => await handleUpload(e)} className="flex">
        <div className={`w-fit flex justify-center items-center ${selectedFiles.length > 0 && "me-2"}`}>
            <label htmlFor="imageUploadInput" className="text-primary px-3 py-2 border border-lime-400 border-dashed cursor-pointer">
                <p className="m-0 text-primary text-base">{selectedFiles.length > 0 ? <>{selectedFiles.length} file{selectedFiles.length > 1 && <>s</>} selected</> : <>Upload Files</>}</p>
            </label>
            <input id="imageUploadInput" type="file" hidden multiple accept="image/*" onChange={e => handleFileChange(e)} />
        </div>
        {selectedFiles.length > 0 && <button type="submit" className="border-2 border-black px-2 py-2 text-primary border-primary" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>}
    </form>
}