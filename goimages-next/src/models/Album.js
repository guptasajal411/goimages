import mongoose from 'mongoose';
import User from './User.js';
import Photo from './Photo.js';

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User is required'],
        ref: User.modelName
    },
    photos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Photo.modelName
    }],
    privacy: {
        type: String,
        enum: ['private', 'shared', 'public'],
        default: 'private'
    },
    accessibility: {
        type: String,
        enum: ['view-only', 'add-images'],
        default: 'view-only'
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User.modelName
    }]
}, {
    timestamps: true
});

albumSchema.methods.addToAlbum = async function (photoId) {
    const photo = await Photo.findById(photoId);
    if (!photo) {
        throw new Error('Photo not found');
    }
    if (this.photos.includes(photoId)) {
        throw new Error('Photo already added to album');
    }
    this.photos.push(photoId);
    await this.save();
};

albumSchema.methods.removeFromAlbum = async function (photoId) {
    const index = this.photos.indexOf(photoId);
    if (index === -1) {
        throw new Error('Photo not found in album');
    }
    this.photos.splice(index, 1);
    await this.save();
};

export default mongoose?.models?.Album || mongoose.model('Album', albumSchema);