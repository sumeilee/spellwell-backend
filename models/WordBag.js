const mongoose = require("mongoose");

const wordBagSchema = new mongoose.Schema({
  title: String,
  words: {
    type: [String],
    required: true,
  },
  consecutive_correct: {
    type: Number,
    required: true,
    default: 2,
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
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const WordBag = mongoose.model("WordBag", wordBagSchema);

module.exports = WordBag;
