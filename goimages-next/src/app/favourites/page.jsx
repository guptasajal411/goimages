import "server-only"
import TopBar from "@/components/homepage/components/TopBar";
import { Suspense } from 'react';
import ImageGridLoading from "@/components/homepage/components/ImageGridLoading";
import Favourites from "./favourites";

export default async function Page() {
    return <>
        <TopBar route="/favourites" />
        <Suspense fallback={<ImageGridLoading />}>
            <Favourites />
        </Suspense>
    </>
}