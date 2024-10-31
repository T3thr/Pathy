import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/backend/models/User";
import GoogleUser from "@/backend/models/GoogleUser";
import LoginActivity from "@/backend/models/LoginActivity";
import mongodbConnect from "@/backend/lib/mongodb";
import bcrypt from "bcryptjs";
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

                // Check email-based sign-in
                const user = credentials.email 
                    ? await User.findOne({ email: credentials.email }).select("+password") 
                    : await User.findOne({ username: credentials.username }).select("+password");

                if (user) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Incorrect password");

                    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                    await LoginActivity.create({ userId: user._id, ipAddress, name: user.name, email: user.email, username: user.username });
                    
                    return { id: user._id, ...user.toObject() };
                }

                throw new Error("No user found with this username or email");
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            await mongodbConnect();
            if (account.provider === "google") {
                const existingUser = await GoogleUser.findOne({ email: user.email });
                if (!existingUser) {
                    await GoogleUser.create({
                        name: user.name,
                        email: user.email,
                        avatar: {
                            url: user.image,
                        },
                        lastLogin: new Date(),
                    });
                } else {
                    existingUser.lastLogin = new Date();
                    await existingUser.save();
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
};
export default options;
