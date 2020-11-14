const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: "story" },
  sequence: { type: Number, default: 0, required: true },
  content: { type: String, required: true },
  connections: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chapter = new mongoose.model("chapter", chapterSchema);
