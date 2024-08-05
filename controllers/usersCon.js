const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userMod");
const { JWT_SECRET } = require("../utils/config.js");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  REQUEST_SUCCESSFUL,
  REQUEST_CREATED,
  DATA_CONFLICT,
} = require("../utils/errorCodes");
// const cl = console.log.bind(console);

module.exports.getCurrentUser = (req, res) => {
  //isolate the user _id from the request body
  const { _id } = req.user;
  //use that _id to find and then respond with the current logged in user
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      cl(err.name);
      return res.status(NOT_FOUND).send({ message: "ERROR" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, RunValidators: true, upsert: true }
  )
    .then((user) => res.status(REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      cl(err.name);
      return res.status(NOT_FOUND).send({ message: "Error!!!" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Email and password is required!" });
  }

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.status(REQUEST_CREATED).send(userObj);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res
            .status(INVALID_DATA)
            .send({ message: "Invalid form entry" });
        }
        if (err.code === 11000) {
          return res
            .status(DATA_CONFLICT)
            .send({ message: "Email already exists in database" });
        }
        return res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      });
  });
};

module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Email and password is required!" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(REQUEST_SUCCESSFUL).send({ token });
    })
    .catch(() => {
      return res
        .status(UNAUTHORIZED_ERROR)
        .send({ message: "Unauthorized user!" });
    });
};
