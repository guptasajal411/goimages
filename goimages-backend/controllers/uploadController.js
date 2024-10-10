import sharp from "sharp";
import Photo from "../models/Photo.js"
import bufferToS3 from "../utils/bufferToS3.js";
import parser from "exif-parser"

export const uploadFiles = async (req, res) => {
    if (!req.files) return res.status(500).json({ success: false, message: `No files found` });
    let processedFiles = 0;
    let totalFiles = req.files.length;
    const totalPhotos = await Photo.countDocuments({ user: req.user._id }).exec();
    if (totalPhotos >= parseInt(process.env.USER_MAX_LIMIT)) return res.status(500).json({ success: false, message: `You have reached your ${process.env.USER_MAX_LIMIT} photos limit.` });
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
                processedFiles++;
                await photo.save();
                const metadata = parser.create(file.buffer);
                const parsedMetadata = metadata.parse();
                if (parsedMetadata?.tags?.["DateTimeOriginal"] || parsedMetadata?.tags?.["CreateDate"]) {
                    photo.createTime = new Date((parsedMetadata?.tags?.["DateTimeOriginal"] || parsedMetadata?.tags?.["CreateDate"]) * 1000)
                }
                await photo.save();
            } else {
                throw new Error("An error occoured")
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: `An error occoured (${processedFiles}/${totalFiles} ${processedFiles > 1 ? "files" : "file"} uploaded)` })
        }
    }
    return res.status(200).json({ success: true, message: "Images backed up to the cloud" })
}