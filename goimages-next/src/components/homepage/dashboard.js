import "server-only";
import UpdateState from "@/components/homepage/components/UpdateState";
import UploadFiles from "./components/UploadFiles";
import { Suspense } from "react";
import ImageGrid from "./components/ImageGrid";
import ImageGridLoading from "./components/ImageGridLoading";

export default async function Dashboard({ userData }) {
    return <div className="p-4">
        <UpdateState isAuthenticated={true} userData={userData} />
        <p className="text-xl">Upload Photos</p>
        <UploadFiles />
        <Suspense fallback={<ImageGridLoading />}>
            <ImageGrid />
        </Suspense>
    </div>
}