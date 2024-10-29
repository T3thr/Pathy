import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/backend/models/User";
import mongodbConnect from "@/backend/lib/mongodb";
import bcrypt from "bcryptjs";

const isUserCredentialsEnabled = process.env.USER_CREDENTIALS_ENABLED === 'true';

export const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your username" },
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await mongodbConnect();
                if (credentials.email) {
                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Incorrect password");
                    }

                    return {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        avatar: user.avatar,
                    };
                }

                if (!isUserCredentialsEnabled) {
                    const admin = {
                        id: 'admin',
                        username: 'admin',
                        password: '123456',
                        name: 'Admin User',
                        email: 'admin@pathy.com',
                        role: 'admin',
                        avatar: 'admin-avatar.jpg'
                    };

                    if (credentials.username === admin.username && credentials.password === admin.password) {
                        return admin;
                    } else {
                        throw new Error("Invalid username or password");
                    }
                }

                throw new Error("No credentials provided");
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async authorize(credentials) {
                await mongodbConnect();

                    return {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: 'admin',
                        avatar: user.avatar,
                    };
                }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                user.role = 'admin';
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.avatar = user.avatar;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.role = token.role;
            session.user.avatar = token.avatar;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default options;
