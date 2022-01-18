const router = require("express").Router();
const User = require("../model/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/userValidation");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    fullName: req.body.fullName,
    role: req.body.role,
  });

  try {
    const savedUser = await user.save();
    const token = JWT.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET, {
      expiresIn: "10h",
    });
    res.header("auth-token", token).send({
      success: 1,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token: token,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/checktoken", async (req, res) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const verified = JWT.verify(token, process.env.TOKEN_SECRET, {
      expiresIn: "10h",
    });
    res.status(200).send({
      success: 1,
      user: verified,
    });
  } catch (err) {
    res.status(400).send({
      success: 0,
      message: "Invalid token. Please login again.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send({
      success: 0,
      message: error.details[0].message,
    });
  }
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).send({
      success: 0,
      message: "Email or password is incorrect",
    });
  }
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).send({
      success: 0,
      message: "Email or password is incorrect",
    });
  }
  const token = JWT.sign(
    {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    process.env.TOKEN_SECRET,

    {
      expiresIn: "10h",
    }
  );
  res.header("authorization", token).send({
    success: 1,
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    token: token,
  });
});

module.exports = router;
