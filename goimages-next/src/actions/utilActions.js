"use server"
import { revalidatePath } from "next/cache";

export async function revalidatePathAction(path) {
    revalidatePath(path);
    return 0;
}