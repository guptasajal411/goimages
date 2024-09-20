"use client"

import { useState } from "react"

export default function UploadFiles() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    function handleFileChange(e) {
        setSelectedFiles(e.target.files);
    }

    async function handleUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        Array.from(selectedFiles).forEach(x => formData.append("files", x));
        const _response = await fetch(`/api/upload`, {
            method: "POST", body: formData, credentials: "include"
        });
    }

    return <form onSubmit={async e => await handleUpload(e)}>
        <input type="file" multiple onChange={e => handleFileChange(e)} />
        <button type="submit" className="border-2 border-black px-2">Upload</button>
    </form>
}