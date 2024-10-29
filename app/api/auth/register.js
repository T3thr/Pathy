import nc from "next-connect";
import mongodbConnect from "@/backend/lib/mongodb";
import { registerUser } from "@/backend/controllers/authControllers";
import onError from "@/backend/middlewares/errors";

const handler = nc({ onError });

mongodbConnect();

handler.post(registerUser);

export default handler;