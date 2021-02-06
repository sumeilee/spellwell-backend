const Practice = require("../models/Practice");

const practiceController = {
  createPractice: async (req, res) => {
    const { wordBag, attempts, user, consecutive_correct } = req.body;

    try {
      const data = await Practice.create({
        wordBag,
        attempts,
        user,
        consecutive_correct,
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

      console.log(data);

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
};

module.exports = practiceController;
