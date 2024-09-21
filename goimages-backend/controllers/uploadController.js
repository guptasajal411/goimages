import redis from "../config/redisConn.js"
import Photo from "../models/Photo.js"

export const uploadFiles = async (req, res) => {
    for (const file of req.files) {
        const photo = new Photo({
            user: req.user._id,
            originalname: file.originalname, encoding: file.encoding, mimetype: file.mimetype, size: file.size
        });
        console.log(photo?._id)
        try {
            await redis.set(`photo:${req.user._id}:${photo._id}`, file.buffer);
            await photo.save();
        } catch (e) {
            console.log(e);
            res.status(500).json({ success: false, message: "an error occoured" })
        }
    }
    res.status(200).json({ success: true, message: "images backed up to the cloud" })
}