// backend/models/Project.js

import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  canvasData: {
    background: { type: Object, default: {} },
    characters: { type: Array, default: [] },
    dialogues: { type: Array, default: [] },
    paths: { type: Array, default: [] },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.models?.Project || mongoose.model("Project", projectSchema);
export default Project;
