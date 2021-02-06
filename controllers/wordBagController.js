const WordBag = require("../models/WordBag");

const wordBagController = {
  createWordBag: async (req, res) => {
    const { title, words, consecutive_correct, identifier, owner } = req.body;

    try {
      const data = await WordBag.create({
        title,
        words,
        consecutive_correct,
        identifier,
        owner,
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error creating word bag",
      });
    }
  },

  updateWordBag: async (req, res) => {
    const { id } = req.params;
    const { title, consecutive_correct, words } = req.body;

    try {
      const doc = await WordBag.findOne({ _id: id });

      if (!doc) {
        res.status(404).json({
          success: false,
          message: "WordBag not found",
        });
        return;
      }

      Object.keys(req.body).forEach((key) => {
        doc[key] = req.body[key];
      });

      await doc.save();

      res.status(200).json({
        success: true,
        message: "WordBag successfully updated",
        doc,
        update_at: Date.now(),
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error updating word bag",
      });
    }
  },

  getWordBag: async (req, res) => {
    const { id } = req.params;

    try {
      const data = await WordBag.findOne({ _id: id });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error getting word bag",
      });
    }
  },

  getWordBags: async (req, res) => {
    const { owner } = req.query;
    console.log(owner);
    try {
      let data;

      if (owner) {
        data = await WordBag.find({ owner });
      } else {
        data = await WordBag.find();
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error getting word bags",
      });
    }
  },

  deleteWordBag: async (req, res) => {
    const { id } = req.params;
    try {
      const doc = await WordBag.findOneAndDelete({ _id: id });

      if (doc) {
        res.status(200).json({
          success: true,
          message: "Word bag successfully deleted",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No word bag of that id found",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error deleting word bags",
      });
    }
  },
};

module.exports = wordBagController;
