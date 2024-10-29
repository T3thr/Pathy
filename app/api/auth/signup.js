// pages/api/auth/signup.js

import nc from "next-connect";
import mongodbConnect from "@/backend/lib/dbConnect";
import { registerUser } from "@/backend/controllers/authControllers";
import onError from "@/backend/middlewares/errors";

const handler = nc({ onError });

mongodbConnect();

handler.post(registerUser);  // Use the corrected function name

export default handler;
