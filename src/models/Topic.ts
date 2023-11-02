import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  messages: [
    {
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now() },
    },
  ],
});

export const Topic = mongoose.model("Topic", topicSchema);
