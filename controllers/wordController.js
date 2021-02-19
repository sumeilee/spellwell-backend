const Word = require("../models/Word");

const wordController = {
  getAllWordSpeech: async (req, res) => {
    const { words } = req.query;

    try {
      const wordArr = words.split(",").map((word) => word.toLowerCase());
      docs = await Word.find({ word: { $in: wordArr } });

      res.status(200).json({
        success: true,
        data: docs,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};

module.exports = wordController;
