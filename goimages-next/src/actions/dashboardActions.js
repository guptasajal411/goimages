"use server"
import "server-only"
import Photo from "@/models/Photo"
import { revalidatePath } from "next/cache"

export async function toggleFavourite(id) {
    let toggledTo;
    try {
        const photo = await Photo.findOne({ _id: id }).exec();
        if (!photo) throw new Error("photo not found")
        toggledTo = !photo.favourite
        photo.favourite = !photo.favourite;
        await photo.save();
    } catch (e) {
        console.log(e)
        return { success: false, message: "Could not add to favourites" }
    }
    revalidatePath("/")
    return { success: true, message: toggledTo ? "Added to favourites" : "Removed from favourites" }
}