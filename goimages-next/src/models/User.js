import mongoose from 'mongoose';
import { hash, compare } from 'bcryptjs';
import * as jose from "jose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (email) => {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
});

userSchema.methods.generateToken = async function () {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";
    const token = await new jose.SignJWT({ _id: this._id, email: this.email, name: this.name })
        .setProtectedHeader({ alg })
        .setExpirationTime("72h")
        .setSubject(process.env.AUTH_COOKIE_NAME)
        .sign(secret);
    return token;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await compare(candidatePassword, this.password);
};

export default mongoose?.models?.User || mongoose.model('User', userSchema);