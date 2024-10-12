"use server"

import "server-only"
import Photo from "@/models/Photo"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import * as jose from "jose"
import dbConn from "@/config/dbConn"
import getS3SignedUrl from "@/utils/getS3SignedUrl"

export async function getUserPhotos(page, perPage = 30, favourite = false) {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    const payload = jose.decodeJwt(cookie.value);
    let returnArray = [];
    let showLoading = false;
    let filter = favourite ? { user: payload?._id, favourite: true } : { user: payload?._id }
    try {
        await dbConn();
        const photos = await Photo.find(filter, undefined, { limit: perPage, skip: perPage * page }).sort("-createTime").select("s3ObjectKey width height favourite").exec();
        const totalPhotos = await Photo.countDocuments(filter).exec();
        if (totalPhotos > perPage + (perPage * page)) showLoading = true
        for (const photo of photos) {
            const signedUrl = getS3SignedUrl(photo?.s3ObjectKey)
            returnArray.push({ src: signedUrl, _id: photo?._id.toString(), height: photo?.height, width: photo?.width, id: photo?._id.toString(), favourite: photo?.favourite })
        }
    } catch (e) {
        console.log(e);
        return { success: false, message: "An error occoured" }
    }
    return { success: true, data: returnArray, showLoading }
}

export async function toggleFavourite(id) {
    let toggledTo;
    try {
        await dbConn();
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
