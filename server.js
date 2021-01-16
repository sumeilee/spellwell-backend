require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

app.get("/api/v1", (req, res) => {
  res.send("You have reached the Spellwell API");
});

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
