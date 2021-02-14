const Practice = require("../models/Practice");

const practiceController = {
  createPractice: async (req, res) => {
    const { wordBag, attempts, user } = req.body;

    //const results = {};
    const words = [...new Set(attempts.map((attempt) => attempt.word))];

    const results = words.map((word) => {
      const wordAttempts = attempts.filter((attempt) => attempt.word === word);
      const correctAttempts = wordAttempts.filter(
        (attempt) => attempt.isCorrect
      );

      const numAttempts = wordAttempts.length;
      const numCorrect = correctAttempts.length;

      return {
        word,
        numAttempts,
        numCorrect,
        accuracy: (numCorrect / numAttempts) * 100,
      };
    });

    try {
      const data = await Practice.create({
        wordBag,
        attempts,
        user,
        results,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error creating practice",
      });
    }
  },

  getPractices: async (req, res) => {
    const { wordBag, user } = req.query;

    try {
      let data;

      if (wordBag && user) {
        data = await Practice.find({ wordBag, user }).populate("wordBag");
      } else if (wordBag) {
        data = await Practice.find({ wordBag }).populate("wordBag");
      } else if (user) {
        data = await Practice.find({ user }).populate("wordBag");
      } else {
        res.status(400).json({
          success: false,
          message: "Please provide word bag id or user id",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error getting practices",
      });
    }
  },

  deletePractice: async (req, res) => {
    const { id } = req.params;

    try {
      const doc = await Practice.findOneAndDelete({ _id: id });

      if (doc) {
        res.status(200).json({
          success: true,
          message: "Practice successfully deleted",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No practice of that id found",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error deleting practice",
      });
    }
  },
};

module.exports = practiceController;
