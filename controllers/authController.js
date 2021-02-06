const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const signToken = (payload, expiresIn) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    // algorithm: "RS256",
    expiresIn,
  });

  return token;
};

const authController = {
  register: async (req, res) => {
    const { username, first_name, last_name, email, password } = req.body;

    try {
      // todo: check if email and username exist

      const password_hash = await bcrypt.hash(password, 10);

      const doc = await User.create({
        username,
        first_name,
        last_name,
        email,
        password_hash,
      });

      const token = signToken({ id: doc._id, username, email }, "1h");
      const rawJWT = jwt.decode(token);

      res.status(201).json({
        success: true,
        token: token,
        expiresAt: rawJWT.exp,
        message: "Registration successful",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error registering user",
      });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    try {
      const user = await User.findOne({ username });

      if (user) {
        const authenticated = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (authenticated) {
          const token = signToken(
            { id: user._id, username: user.username, email: user.email },
            "1h"
          );
          console.log(token);
          const rawJWT = jwt.decode(token);
          console.log(rawJWT);

          res.status(200).json({
            success: true,
            token: token,
            expiresAt: rawJWT.exp,
            message: "Log in successful",
          });

          return;
        }
      }

      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        success: false,
        message: "Error logging user in",
      });
    }
  },
};

module.exports = authController;
