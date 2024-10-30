// backend/models/LoginGActivity.js
import mongoose from 'mongoose';

const LoginGActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, "Please enter your name"],
      },
    username: {
        type: String, // Change this to String to store the username directly
        required: true,
    },
    email: { // Optionally add an email field if you want to store email too
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false,
      },
    ipAddress: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const LoginGActivity = mongoose.models?.LoginGActivity || mongoose.model('LoginGActivity', LoginGActivitySchema);

export default LoginGActivity;
