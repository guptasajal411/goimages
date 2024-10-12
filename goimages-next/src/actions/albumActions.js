"use server"

import "server-only";
import { cookies } from "next/headers";
import * as jose from "jose"
import Album from "@/models/Album";
import mongoose from "mongoose";
import ClientError from "@/lib/ClientErrorClass";

export async function createAlbumAction(prevState, formData) {
    try {
        const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
        const { _id: userId } = jose.decodeJwt(cookie.value);
        const title = formData.get("title");
        const privacy = formData.get("privacy");
        const accessibility = formData.get("accessibility");
        const photos = JSON.parse(formData.get("photos") || "[]");
        const emails = formData.get("emails");
        if (!photos.length) {
            throw new ClientError("Add photos to add to album");
        }
        const photoIds = photos.map((photo) => photo.photoId);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const emailsArray = emails
            ? emails.split(/[\r\n]+/).filter((email) => emailRegex.test(email.trim()))
            : [];
        const album = new Album({
            title,
            user: userId,
            photos: photoIds,
            privacy,
            accessibility,
            sharedWith: privacy === "shared" ? emailsArray : undefined,
        });
        console.log(album);
        await album.save();
        return { success: true, message: "Album created successfully", actionResponse: true, redirect: `/albums/${album._id.toString()}` };
    } catch (error) {
        console.error(error.message);
        if (error instanceof mongoose.Error.ValidationError) {
            return { success: false, message: error._message, actionResponse: true };
        } else if (error instanceof ClientError) {
            return { success: false, message: error.message, actionResponse: true };
        }
        return { success: false, message: "An error occurred", actionResponse: true };
    }
}