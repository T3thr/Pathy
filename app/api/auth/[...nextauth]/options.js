import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/backend/models/User";
import mongodbConnect from "@/backend/lib/mongodb";
import bcrypt from "bcryptjs";
import LoginActivity from "@/backend/models/LoginActivity";
import GoogleUser from "@/backend/models/GoogleUser";
import mongoose from 'mongoose';

export const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your username" },
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                await mongodbConnect();
                let user;

                // Check for email sign-in
                if (credentials.email) {
                    user = await User.findOne({ email: credentials.email }).select("+password");
                } else if (credentials.username) {
                    // Check for username sign-in
                    user = await User.findOne({ username: credentials.username }).select("+password");
                }

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    // Log login activity
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    await LoginActivity.create({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        ipAddress: ipAddress,
                    });
                    
                    // Update lastLogin
                    user.lastLogin = Date.now();
                    await user.save();

                    return { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role };
                }

                // Admin hardcoded credentials check
                const adminId = new mongoose.Types.ObjectId(); // Use a predefined admin ID from environment variable
                const adminPassword = 'admin123'; // Keep this secure; ideally, it should be hashed

                if (credentials.username === 'Admin' && credentials.password === adminPassword) {
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    
                    await LoginActivity.create({
                        userId: adminId,
                        email: 'admin@pathy.com',
                        name: 'admin',
                        username: 'Admin',
                        ipAddress: ipAddress,
                        role: 'admin',
                    });

                    return { id: adminId, name: 'admin', username: 'Admin', email: 'admin@pathy.com', role: 'admin' };
                }

                throw new Error("No user found with this username or email");
            },
        }),
        GoogleProvider({
            name: "Google",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                },
            },
            async authorize(profile) {
                await mongodbConnect();

                const existingUser = await GoogleUser.findOne({ email: profile.email });
                if (existingUser) {
                    // Update last login time
                    existingUser.lastLogin = new Date();
                    await existingUser.save();
                    return { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: 'google_user' }; // Add role if necessary
                }

                // Create a new user if they don't exist
                const newUser = new GoogleUser({
                    name: profile.name,
                    email: profile.email,
                    avatar: {
                        public_id: null,
                        url: profile.picture,
                    },
                    lastLogin: new Date(),
                });
                await newUser.save();
                return { id: newUser._id, name: newUser.name, email: newUser.email, role: 'google_user' }; // Add role if necessary
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id; // Add user ID to the session
            session.user.role = user.role || 'user'; // Ensure role is present
            return session;
        },
    },
};

export default options;
