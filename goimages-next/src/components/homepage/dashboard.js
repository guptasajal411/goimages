import "server-only";
import UpdateState from "@/components/homepage/components/UpdateState";
import { Suspense } from "react";
import ImageGrid from "./components/ImageGrid";
import ImageGridLoading from "./components/ImageGridLoading";
import TopBar from "./components/TopBar";

export default async function Dashboard({ userData }) {
    return <div className="p-4 pt-0">
        <UpdateState isAuthenticated={true} userData={userData} />
        <TopBar route="/" />
        <Suspense fallback={<ImageGridLoading />}>
            <ImageGrid />
        </Suspense>
    </div>
}