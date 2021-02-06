const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema({
  wordBag: {
    type: mongoose.Schema.ObjectId,
    ref: "WordBag",
    required: true,
  },
  attempts: {
    type: [Object],
    required: true,
  },
  consecutive_correct: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Practice = mongoose.model("Practice", practiceSchema);

module.exports = Practice;
