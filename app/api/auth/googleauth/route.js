// app/api/auth/googleauth/route.js
import mongodbConnect from "@/backend/lib/mongodb";
import User from "@/backend/models/User";
import LoginActivity from "@/backend/models/LoginActivity";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { profile } = req.body;

        if (!profile) {
            return res.status(400).json({ message: "Profile data is required." });
        }

        await mongodbConnect();

        try {
            // Check if user already exists in the database
            let user = await User.findOne({ email: profile.email });

            // If user doesn't exist, create a new user
            if (!user) {
                user = await User.create({
                    name: profile.name,
                    email: profile.email,
                    username: profile.email.split('@')[0], // Use email prefix as username
                    avatar: profile.picture,
                });
            }

            // Log login activity
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await LoginActivity.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                ipAddress: ipAddress,
            });

            // Respond with the user data
            return res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            });
        } catch (error) {
            console.error("Error handling Google authentication:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
