"use server";

import dbConn from "@/config/dbConn";

export default async function RegisterAction(prevState, formData) {
    await dbConn();
    console.log({ prevState })
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(formData.get("email"));
    return { success: true, message: "user registered" }
}