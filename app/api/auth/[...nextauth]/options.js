import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/backend/models/User";
import mongodbConnect from "@/backend/lib/mongodb";
import bcrypt from "bcryptjs";
import LoginActivity from "@/backend/models/LoginActivity";
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
            
                // Check for email sign-in
                if (credentials.email) {
                    const user = await User.findOne({ email: credentials.email }).select("+password");
            
                    if (!user) {
                        throw new Error("No user found with this email");
                    }
            
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            
                    if (!isPasswordValid) {
                        throw new Error("Incorrect password");
                    }
            
                    // Log login activity
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    await LoginActivity.create({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        ipAddress: ipAddress,
                    });
            
                    return { id: user._id, ...user.toObject() };
                }
            
                // Check for username sign-in
                const user = await User.findOne({ username: credentials.username }).select("+password");
            
                if (user) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            
                    if (!isPasswordValid) {
                        throw new Error("Incorrect password");
                    }
            
                    // Log login activity
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    await LoginActivity.create({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        ipAddress: ipAddress,
                    });
            
                    return { id: user._id, ...user.toObject() };
                }
            
                // Admin hardcoded credentials check
                const adminId = new mongoose.Types.ObjectId(); // Use a predefined admin ID from environment variable
                const adminPassword = 'admin123'; // Keep this secure; ideally, it should be hashed
            
                if (credentials.username === 'Admin' && credentials.password === adminPassword) {
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                    
                    await LoginActivity.create({
                        userId: adminId, // Use the predefined admin ID
                        email: 'admin@pathy.com',
                        name:'admin',
                        username: 'Admin',
                        ipAddress: ipAddress,
                        role:'admin',
                    });
            
                    return { id: adminId,name: 'admin', username: 'Admin', email: 'admin@pathy.com', role: 'admin' };
                }
            
                throw new Error("No user found with this username");
            },
        }),
        CredentialsProvider({
            // CredentialsProvider setup remains the same
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async authorize(credentials, req) {
                await mongodbConnect();

                const profile = credentials; // Use the Google profile directly

                let user = await User.findOne({ email: profile.email });

                if (!user) {
                    user = await User.create({
                        name: profile.name,
                        email: profile.email,
                        username: profile.email.split('@')[0], // Simple username generation
                        avatar: profile.picture,
                    });
                }

                const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                await LoginActivity.create({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    ipAddress: ipAddress,
                });

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    role: 'user',
                    avatar: user.avatar,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === 'google') {
                user.role = 'user';
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.username = user.username;
                token.email = user.email;
                token.role = user.role;
                token.avatar = user.avatar;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.username = token.username;
            session.user.email = token.email;
            session.user.role = token.role;
            session.user.avatar = token.avatar;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default options;
