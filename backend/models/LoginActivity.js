// backend/models/LoginActivity.js
import mongoose from 'mongoose';

const LoginActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    name: {
        type: String,
        required: [false, "Please enter your name"],
      },
    username: {
        type: String, // Change this to String to store the username directly
        required: false,
    },
    email: { // Optionally add an email field if you want to store email too
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [false, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false,
      },
    role: {
        type: String,
        default: "user",
        required: false,
    },
    ipAddress: {
        type: String,
        required: false,
    },
    avatar: {
        type: String, // URL for the user's avatar (if applicable)
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    },
    { timestamps: true }
);

const LoginActivity = mongoose.models?.LoginActivity || mongoose.model('LoginActivity', LoginActivitySchema);

export default LoginActivity;
