import Photo from "../models/Photo.js"
import photoQueue from '../queues/photoQueue.js'

export const uploadFiles = async (req, res) => {
    for (const file of req.files) {
        const photo = new Photo({
            user: req.user._id,
            originalname: file.originalname, encoding: file.encoding, mimetype: file.mimetype, size: file.size
        });
        try {
            const queueResponse = await photoQueue.add(`photo:${req.user._id}:${photo._id}`, file);
            await photo.save();
        } catch (e) {
            console.log(e);
            res.status(500).json({ success: false, message: "an error occoured" })
        }
    }
    res.status(200).json({ success: true, message: "images backed up to the cloud" })
}