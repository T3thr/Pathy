import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/backend/models/User";
import GoogleUser from "@/backend/models/GoogleUser";
import mongodbConnect from "@/backend/lib/mongodb";
import bcrypt from "bcryptjs";
import LoginActivity from "@/backend/models/LoginActivity";
import mongoose from "mongoose";

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

                // Check for email sign-in
                if (credentials.email) {
                    const user = await User.findOne({ email: credentials.email }).select("+password");
                    if (!user) throw new Error("No user found with this email");

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Incorrect password");

                    // Update lastLogin field
                    user.lastLogin = new Date();
                    await user.save();

                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    await LoginActivity.create({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        ipAddress,
                        lastLogin: user.lastLogin // Use updated lastLogin time
                    });

                    return { id: user._id, ...user.toObject() };
                }

                // Check for username sign-in
                const user = await User.findOne({ username: credentials.username }).select("+password");
                if (user) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Incorrect password");

                    // Update lastLogin field
                    user.lastLogin = new Date();
                    await user.save();

                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    await LoginActivity.create({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        ipAddress,
                        lastLogin: user.lastLogin // Use updated lastLogin time
                    });

                    return { id: user._id, ...user.toObject() };
                }

                // Admin hardcoded credentials check
                const adminId = new mongoose.Types.ObjectId(); // Use a predefined admin ID from environment variable
                const adminPassword = 'admin123'; // Keep this secure; ideally, it should be hashed

                if (credentials.username === 'Admin' && credentials.password === adminPassword) {
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                    await LoginActivity.create({
                        userId: adminId,
                        email: 'admin@pathy.com',
                        name: 'admin',
                        username: 'Admin',
                        ipAddress: ipAddress,
                        role: 'admin',
                        lastLogin: new Date() // Update lastLogin time
                    });

                    return { id: adminId, name: 'admin', username: 'Admin', email: 'admin@pathy.com', role: 'admin' };
                }

                throw new Error("No user found with this username");
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                },
            },
            async profile(profile, req) {
                await mongodbConnect();
                
                const existingUser = await GoogleUser.findOne({ email: profile.email });

                // Log the login activity for Google sign-in
                const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                if (existingUser) {
                    existingUser.lastLogin = new Date();
                    await existingUser.save();
                } else {
                    await GoogleUser.create({
                        name: profile.name,
                        email: profile.email,
                        avatar: { url: profile.picture },
                        lastLogin: new Date(),
                    });
                }

                await LoginActivity.create({
                    userId: existingUser ? existingUser._id : new mongoose.Types.ObjectId(), // Use existing user ID if found, else create a new ID
                    name: profile.name,
                    email: profile.email,
                    username: profile.email.split('@')[0], // Using email's local part as username
                    ipAddress,
                    lastLogin: new Date(), // Set the last login time
                });

                return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.sub = profile.id;
            }
            return token;
        }
    },

    debug: true,
};

export default options;
