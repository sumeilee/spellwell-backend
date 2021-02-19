const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  audioData: {
    String,
    required: true,
  },
  languageCode: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  audioEncoding: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
