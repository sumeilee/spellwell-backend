const textToSpeech = require("@google-cloud/text-to-speech");

const Word = require("../models/Word");

const client = new textToSpeech.TextToSpeechClient();

const speechApi = {
  getWordSpeech: async (
    word,
    languageCode = "en-US",
    gender = "NEUTRAL",
    audioEncoding = "MP3",
    speakingRate = 0.7
  ) => {
    const request = {
      input: { text: word },
      voice: { languageCode, ssmlGender: gender },
      audioConfig: { audioEncoding, speakingRate },
    };

    console.log(request);

    try {
      const [response] = await client.synthesizeSpeech(request);

      const data = {
        word,
        audioData: Buffer.from(response.audioContent).toString("base64"),
        languageCode,
        gender,
        audioEncoding,
        speakingRate,
      };

      return data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },

  getAllWordSpeech: async function (
    words,
    languageCode = "en-US",
    gender = "NEUTRAL",
    audioEncoding = "MP3",
    saveToDb = true,
    speakingRate = 0.7
  ) {
    try {
      const allWordSpeech = [];
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        console.log("getting word speech for " + word);

        const wordSpeech = await this.getWordSpeech(
          word,
          (languageCode = languageCode),
          (gender = gender),
          (audioEncoding = audioEncoding),
          (speakingRate = speakingRate)
        );

        allWordSpeech.push(wordSpeech);
      }

      if (saveToDb) {
        await Word.insertMany(allWordSpeech);
      }

      return allWordSpeech;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
};

module.exports = speechApi;
