import { NextResponse } from "next/server"

export async function POST(request) {
    console.log("Test")
    const formData = await request.formData();
    console.log(formData)
    return NextResponse.json({ success: true, message: "test success" })
}