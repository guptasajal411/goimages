import UpdateState from "@/components/home/UpdateState";
import "server-only";

export default async function Dashboard({ userData }) {
    return <div>
        <p className="text-lg">authenticated</p>
        <UpdateState isAuthenticated={true} userData={userData} />
    </div>
}