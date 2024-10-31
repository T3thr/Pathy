// models/GoogleUser.js

import mongoose from "mongoose";

const GoogleUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
}, { timestamps: true });

export default mongoose.models.GoogleUser || mongoose.model("GoogleUser", GoogleUserSchema);
