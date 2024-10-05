
import { Libre_Baskerville, PT_Sans } from "next/font/google"

export const libreBaskerville = Libre_Baskerville({
    weight: "700",
    style: "normal",
    preload: true,
    subsets: ["latin"]
})

export const ptSans = PT_Sans({
    weight: ["400", "700"],
    style: "normal",
    preload: false
})