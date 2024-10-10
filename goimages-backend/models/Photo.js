import mongoose from 'mongoose';
import User from './User.js';

const photoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user is required'],
        ref: User.modelName
    },
    originalname: String,
    encoding: String,
    mimetype: String,
    size: Number,
    s3ObjectKey: String,
    height: Number,
    width: Number,
    favourite: { type: Boolean, default: false },
    createTime: { type: Date, default: Date.now }
}, {
    timestamps: true,
    validate: {
        validator: async function () {
            const photoCount = await mongoose.models.Photo.countDocuments({ user: this.user });
            if (photoCount >= parseInt(process.env.USER_MAX_LIMIT)) {
                return this.constructor.ValidationError(`You have reached the maximum limit of ${process.env.USER_MAX_LIMIT} photos.`);
            }
        },
        message: `You have reached the maximum limit of ${process.env.USER_MAX_LIMIT} photos.`
    }
});

export default mongoose?.models?.Photo || mongoose.model('Photo', photoSchema);