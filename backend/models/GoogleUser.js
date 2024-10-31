// backend/models/GoogleUser.js

import mongoose from 'mongoose';

const GoogleUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const GoogleUser = mongoose.models.GoogleUser || mongoose.model('GoogleUser', GoogleUserSchema);

export default GoogleUser;
