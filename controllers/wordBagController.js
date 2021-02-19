const speechApi = require("../services/text-to-speech");

const WordBag = require("../models/WordBag");
const Word = require("../models/Word");

const wordBagController = {
  createWordBag: async (req, res) => {
    const { title, words, consecutive_correct, identifier, owner } = req.body;

    try {
      let docs = await Word.find({ word: { $in: words } });

      if (docs.length !== words.length) {
        const addWords = words.filter(
          (word) => !docs.map((doc) => doc.word).includes(word)
        );
        console.log(addWords);

        await speechApi.getAllWordSpeech(addWords);

        docs = await Word.find({ word: { $in: words } });
      }

      const wordBag = await WordBag.create({
        title,
        words,
        consecutive_correct,
        identifier,
        owner,
      });

      const data = {
        ...wordBag,
        audio: docs.map((doc) => ({
          word: doc.word,
          audioData: doc.audioData,
        })),
      };

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        success: false,
        message: "Error creating word bag",
      });
    }
  },

  updateWordBag: async (req, res) => {
    const { id } = req.params;
    const { words } = req.body;

    try {
      const doc = await WordBag.findOne({ _id: id });

      if (!doc) {
        res.status(404).json({
          success: false,
          message: "WordBag not found",
        });
        return;
      }

      if (words) {
        let docs = await Word.find({ word: { $in: words } });

        if (docs.length !== words.length) {
          const addWords = words.filter(
            (word) => !docs.map((doc) => doc.word).includes(word)
          );
          console.log(addWords);

          await speechApi.getAllWordSpeech(addWords);
        }
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
      console.log(err.message);
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

  unlinkWordBag: async (req, res) => {
    const { id } = req.params;
    try {
      const doc = await WordBag.findOne({ _id: id });

      if (doc) {
        doc.owner = null;
        await doc.save();

        res.status(200).json({
          success: true,
          message: "Word bag successfully deleted from user's list",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No word bag of that id found",
        });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        success: false,
        message: "Error deleting word bag from user's list",
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
