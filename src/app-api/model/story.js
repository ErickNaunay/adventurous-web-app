const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  summary: { type: String, required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  createdAt: { type: Date, default: Date.now },
});

const Story = new mongoose.model('story', storySchema)