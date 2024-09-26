import sharp from "sharp";
import Photo from "../models/Photo.js"
import bufferToS3 from "../utils/bufferToS3.js";

export const uploadFiles = async (req, res) => {
    for (const file of req.files) {
        const photo = new Photo({
            user: req.user._id,
            originalname: file.originalname, encoding: file.encoding, mimetype: file.mimetype, size: file.size
        });
        const fileFormat = file.originalname.split(".").pop();
        try {
            // for BullMQ based uploads
            // const queueResponse = await photoQueue.add(`photo:${req.user._id}:${photo._id}`, file);
            const s3Response = await bufferToS3(file.buffer, req.user._id, photo?._id, fileFormat);
            if (s3Response.success) {
                const { height, width } = await sharp(file.buffer).metadata();
                photo.s3ObjectKey = s3Response?.s3ObjectKey;
                photo.height = height; photo.width = width;
                await photo.save();
            } else {
                throw new Error("An error occoured")
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ success: false, message: "An error occoured" })
        }
    }
    res.status(200).json({ success: true, message: "Images backed up to the cloud" })
}