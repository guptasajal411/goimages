"use client"

import { revalidatePathAction } from "@/actions/utilActions";
import { useState } from "react"
import toast from "react-hot-toast";

export default function UploadFiles() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    function handleFileChange(e) {
        setSelectedFiles(e.target.files);
    }

    async function handleUpload(e) {
        e.preventDefault();
        setIsUploading(true);
        const formData = new FormData();
        Array.from(selectedFiles).forEach(x => formData.append("files", x));
        const _response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
            method: "POST", body: formData, credentials: "include"
        });
        const response = await _response.json();
        response?.success ? toast.success(response.message) : toast.error(response.message);
        setIsUploading(false);
        setSelectedFiles([]);
        revalidatePathAction("/");
        return 0;
    }

    return <form onSubmit={async e => await handleUpload(e)} className="flex">
        <div className="w-fit flex justify-center items-center me-2">
            <label htmlFor="imageUploadInput" className="text-primary px-3 py-2 border border-lime-400 border-dashed cursor-pointer">
                <p className="m-0 text-primary text-base">{selectedFiles.length > 0 ? <>{selectedFiles.length} file{selectedFiles.length > 1 && <>s</>} selected</> : <>Upload Files</>}</p>
            </label>
            <input id="imageUploadInput" type="file" hidden multiple accept="image/*" onChange={e => handleFileChange(e)} />
        </div>
        {selectedFiles.length > 0 && <button type="submit" className="border-2 border-black px-2 py-2 text-primary border-primary" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>}
    </form>
}