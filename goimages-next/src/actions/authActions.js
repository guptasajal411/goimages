"use server";

export default async function RegisterAction(prevState, formData) {
    console.log({ prevState })
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(formData.get("email"));
    return { success: true, message: "user registered" }
}