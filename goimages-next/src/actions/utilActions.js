"use server"
import "server-only"
import { revalidatePath } from "next/cache";

export async function revalidatePathAction(path) {
    revalidatePath(path);
    return 0;
}