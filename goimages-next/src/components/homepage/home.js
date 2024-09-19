import "server-only";
import { useAppSelector } from "@/store/hooks"
import UpdateState from "@/components/homepage/components/UpdateState";

export default async function Home() {

    return <div className="p-4">
        <UpdateState isAuthenticated={false} />
        <p className="text-xl">unauthenticated</p>
    </div>
}