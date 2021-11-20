const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");

// Create new user
router.post("/signup", async function (req, res) {
  try {
    // Encrypt User Password
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // Save User and response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch(error) {
      res.status(500).json(error);
  };
});

// Sign in existing User
router.post('/signin', async function(req, res) {
  try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(404).send("User does not exist");

    // Validate Password
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      !isValidPassword && res.status(400).json("Wrong Password");

    // Retrieve User from Database 
      res.status(200).json(user);

  } catch(error) {
    res.status(500).json(error);
  };
});

module.exports = router;
