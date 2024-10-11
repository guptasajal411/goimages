"use server"

import "server-only";

export async function createAlbumAction(prevState, formData) {
    console.log(formData.get("title"));
    return { success: false, message: "Feature under construction", actionResponse: true }
}