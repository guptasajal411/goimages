import UpdateState from "@/components/homepage/components/UpdateState";
import "server-only";
import UploadFiles from "./components/UploadFiles";
import { Suspense } from "react";
import ImageGrid from "./components/ImageGrid";

export default async function Dashboard({ userData }) {
    return <div className="p-4">
        <UpdateState isAuthenticated={true} userData={userData} />
        <p className="text-xl">Upload Photos</p>
        <UploadFiles />
        <Suspense fallback={<h1 className="text pt-4">Loading...</h1>}>
            <ImageGrid />
        </Suspense>
    </div>
}