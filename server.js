require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.port || 5000;

const authController = require("./controllers/authController");
const wordBagController = require("./controllers/wordBagController");
const practiceController = require("./controllers/practiceController");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

/* ROUTES */
app.get("/api/v1", (req, res) => {
  res.send("You have reached the Spellwell API");
});

app.post("/api/v1/register", authController.register);
app.post("/api/v1/login", authController.login);

app.get("/api/v1/wordbags", wordBagController.getWordBags);
app.get("/api/v1/wordbags/:id", wordBagController.getWordBag);
app.patch("/api/v1/wordbags/:id/edit", wordBagController.updateWordBag);
app.delete("/api/v1/wordbags/:id", wordBagController.deleteWordBag);
app.post("/api/v1/wordbags/new", wordBagController.createWordBag);

app.get("/api/v1/practices", practiceController.getPractices);
app.post("/api/v1/practices/new", practiceController.createPractice);

/* CONNECT TO DATABASE AND SERVER */
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connection successful");
    app.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
