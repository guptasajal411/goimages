"use server"

import "server-only";
import { cookies } from "next/headers";
import * as jose from "jose"
import Album from "@/models/Album";
import mongoose, { Types } from "mongoose";
import ClientError from "@/lib/ClientErrorClass";
import dbConn from "@/config/dbConn";
import User from "@/models/User";
import Photo from "@/models/Photo";
import getS3SignedUrl from "@/utils/getS3SignedUrl";

export async function createAlbumAction(prevState, formData) {
    try {
        const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
        const { _id: userId } = jose.decodeJwt(cookie.value);
        const title = formData.get("title");
        const privacy = formData.get("privacy") ?? undefined;
        const accessibility = formData.get("accessibility") ?? undefined;
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
        const sharedWith = [];
        await dbConn();
        if (emailsArray.length > 0) {
            for (const email of emailsArray) {
                const foundUser = await User.findOne({ email }).select("_id").exec();
                foundUser && sharedWith.push(foundUser?._id.toString())
            }
        }
        const album = new Album({
            title,
            user: userId,
            photos: photoIds,
            privacy,
            accessibility: privacy === "private" ? "add-images" : accessibility,
            sharedWith: privacy === "shared" ? sharedWith : undefined,
        });
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

export async function getUserAlbums() {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    const payload = jose.decodeJwt(cookie.value);
    let returnArray = [];
    let filter = { $or: [{ user: payload?._id }, { sharedWith: payload?._id }] }
    try {
        await dbConn();
        const albums = await Album.find(filter).sort("-createTime").select("title").exec();
        returnArray = albums.map(x => x.toObject())
    } catch (e) {
        console.log(e);
        return { success: false, message: "An error occoured" }
    }
    return { success: true, data: returnArray }
}

export async function getUserAlbumById(id) {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    const payload = jose.decodeJwt(cookie.value);
    await dbConn();
    const album = await Album.find({ $or: [{ user: payload?._id }, { sharedWith: payload?._id }] }).select("-sharedWith").exec();
    if (!album) return { success: false, message: "Album not found", actionResponse: true }
    let returnAlbum = album.filter(x => x?._id.toString() === id)[0]
    if (!returnAlbum) return { success: false, message: "No permission", actionResponse: true }
    if (!returnAlbum.photos.length > 0) return { success: false, message: "No photos found", actionResponse: true }
    let photoArray = [];
    for (const photo of returnAlbum.photos) {
        const foundPhoto = await Photo.findOne({ _id: photo }).sort("-createTime").select("s3ObjectKey width height").exec();
        const signedUrl = getS3SignedUrl(foundPhoto.s3ObjectKey)
        photoArray.push({ ...foundPhoto.toObject(), src: signedUrl, s3ObjectKey: undefined });
    }
    return { success: true, data: { ...returnAlbum.toObject(), photoArray }, actionResponse: true }
}

export async function addPhotoToAlbum(prevState, formData) {
    const cookie = cookies().get(process.env.AUTH_COOKIE_NAME);
    const payload = jose.decodeJwt(cookie.value);
    const albumid = formData.get("albumid")
    const photos = formData.get("photos")
    if (!albumid || !photos) return { success: false, message: "Incorrect input", actionResponse: true }
    try {
        await dbConn();
        const foundUser = await User.findOne({ _id: payload?._id }).select("_id").exec();
        if (!foundUser) return { success: false, message: "User not found", actionResponse: true }
        const query = { $or: [{ user: foundUser._id }, { $and: [{ sharedWith: foundUser._id }, { accessibility: 'add-images' }, { privacy: 'shared' }] }] }
        const album = await Album.find(query).select("-sharedWith").exec();
        if (!album) return { success: false, message: "No permission", actionResponse: true }
        let returnAlbum = album.filter(x => x?._id.toString() === albumid)[0]
        if (!returnAlbum) return { success: false, message: "No permission", actionResponse: true }
        if (!returnAlbum.photos.length > 0) return { success: false, message: "No photos found", actionResponse: true }
        let jsonPhotos = JSON.parse(photos);
        let totalPhotos = jsonPhotos.length, processedPhotos = 0;
        for (const photo of jsonPhotos) {
            if (mongoose.isValidObjectId(photo?.photoId) && !returnAlbum.photos.includes(Types.ObjectId.createFromHexString(photo?.photoId))) {
                returnAlbum.photos.push(Types.ObjectId.createFromHexString(photo?.photoId));
                processedPhotos++;
            }
        }
        await returnAlbum.save();
        return { success: true, message: `${processedPhotos}/${totalPhotos} photo${totalPhotos > 1 ? "s" : ""} were added to the album`, actionResponse: true, redirect: `/albums/${returnAlbum._id}` }
    } catch (e) {
        console.log(e)
        return { success: false, message: "An error occoured", actionResponse: true }
    }
}