const { users } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const convertToBase64 = (file) => {
//   return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
// };

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: 180000000000000,
  });
};

module.exports.signUp = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      pictureUrl,
      dateOfBirth,
      firstName,
      lastName,
      sex,
      phoneNumber,
      favoriteBrand,
      shoeSize,
    } = req.body;
    const saltRounds = 10;

    const thatUser = await users.findOne({ email: email });
    if (thatUser) {
      return res
        .status(409)
        .json({ message: "This email already has an account" });
    }

    const thisUser = await users.findOne({ userName: userName });
    if (thisUser) {
      return res
        .status(409)
        .json({ message: "This username already has an account" });
    }

    if (userName && email && password) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const user = await users.create({
          userName,
          email,
          password: hash,
          pictureUrl,
          dateOfBirth,
          firstName,
          lastName,
          sex,
          phoneNumber,
          favoriteBrand,
          shoeSize,
        });

        const token = createToken(user._id);
        res.status(201).json({ user, token });
      });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Wrong Email/Password " });
      return;
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      res.status(400).json({ message: "Wrong Email/Password " });
      return;
    }
    const token = createToken(user._id);
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(401).json({ e });
  }
};
