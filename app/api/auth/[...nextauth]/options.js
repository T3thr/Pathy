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
                    if (!user) throw new Error("No user found with this email");

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Incorrect password");

                    // Log login activity
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    await LoginActivity.create({ userId: user._id, name: user.name, email: user.email, username: user.username, ipAddress });

                    return { id: user._id, ...user.toObject() };
                }

                // Check for username sign-in
                user = await User.findOne({ username: credentials.username }).select("+password");
                if (user) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Incorrect password");

                    // Log login activity
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    await LoginActivity.create({ userId: user._id, name: user.name, email: user.email, username: user.username, ipAddress });

                    return { id: user._id, ...user.toObject() };
                }

                // Admin hardcoded credentials check
                const adminId = new mongoose.Types.ObjectId(); // Use a predefined admin ID
                const adminPassword = 'admin123'; // Keep this secure; ideally, it should be hashed

                if (credentials.username === 'Admin' && credentials.password === adminPassword) {
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    await LoginActivity.create({ userId: adminId, email: 'admin@pathy.com', name: 'admin', username: 'Admin', ipAddress, role: 'admin' });

                    return { id: adminId, name: 'admin', username: 'Admin', email: 'admin@pathy.com', role: 'admin' };
                }

                throw new Error("No user found with this username");
            },
        }),
        GoogleProvider({
            name: "google",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                },
            },
            async profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    avatar: profile.picture,
                };
            },
            async authorize(profile, req) {
                await mongodbConnect();

                // Find user by email
                let user = await GoogleUser.findOne({ email: profile.email });
                if (!user) {
                    user = await GoogleUser.create({
                        name: profile.name,
                        email: profile.email,
                        avatar: {
                            public_id: profile.sub,
                            url: profile.picture,
                        },
                    });
                } else {
                    // Update lastLogin if the user exists
                    user.lastLogin = new Date();
                    await user.save();
                }

                // Log login activity (optional)
                const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                await LoginActivity.create({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    ipAddress,
                });

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user', // Default to 'user' if role is not defined
                    avatar: user.avatar,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await mongodbConnect();

            const existingUser = await GoogleUser.findOne({ email: user.email });
            if (existingUser) {
                existingUser.lastLogin = new Date();
                await existingUser.save();
                return true;
            }

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
            return true;
        },
        async session({ session, user }) {
            session.user.id = user.id; // Add user ID to the session
            return session;
        },
    },
};

export default options;
