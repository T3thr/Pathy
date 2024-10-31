import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    avatar: {
        public_id: { type: String },
        url: { type: String },
    },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.GoogleUser || mongoose.model('GoogleUser', googleUserSchema);
