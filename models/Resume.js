const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  skills: [String],
  score: Number,
  filename: String
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
