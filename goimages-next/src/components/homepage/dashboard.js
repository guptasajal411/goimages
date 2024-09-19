import UpdateState from "@/components/homepage/components/UpdateState";
import "server-only";
import UploadFiles from "./components/UploadFiles";

export default async function Dashboard({ userData }) {
    return <div className="p-4">
        <UpdateState isAuthenticated={true} userData={userData} />
        <p className="text-xl">Upload Photos</p>
        <UploadFiles />
    </div>
}