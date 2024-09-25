"use client"

import { revalidatePathAction } from "@/actions/utilActions";
import { useState } from "react"
import toast from "react-hot-toast";

export default function UploadFiles() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    function handleFileChange(e) {
        setSelectedFiles(e.target.files);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        Array.from(selectedFiles).forEach(x => formData.append("files", x));
        const _response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
            method: "POST", body: formData, credentials: "include"
        });
        const response = await _response.json();
        response?.success ? toast.success(response.message) : toast.error(response.message);
        revalidatePathAction("/");
        return 0;
    }

    return <form onSubmit={async e => await handleUpload(e)}>
        <input type="file" multiple accept="image/*" onChange={e => handleFileChange(e)} />
        <button type="submit" className="border-2 border-black px-2">Upload</button>
    </form>
}