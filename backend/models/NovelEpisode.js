// backend/models/NovelEpisode.js
import mongoose from 'mongoose';

const NovelEpisodeSchema = new mongoose.Schema({
  novelTitle: { type: String, required: true }, 
  titles: [{ type: String, required: true }], 
  contents: [{ type: String, required: true }], 
  choices: [
    {
      text: { type: String, required: true },
      nextChapter: { type: Number, required: true },
    },
  ],
}, {
    timestamps: true, 
  });

// Check for existing model or create a new one
export default mongoose.models.NovelEpisode || mongoose.model('NovelEpisode', NovelEpisodeSchema);