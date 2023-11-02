import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
});

export const User = mongoose.model("User", userSchema);
