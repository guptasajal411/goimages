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
    size: Number
}, {
    timestamps: true,
});

export default mongoose?.models?.Photo || mongoose.model('Photo', photoSchema);