import "server-only";
import { useAppSelector } from "@/store/hooks"
import UpdateState from "@/components/home/UpdateState";

export default async function Home() {
    <UpdateState isAuthenticated={false} />
    return <p className="text-lg">unauthenticated</p>
}