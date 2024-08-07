const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userMod");
const { JWT_SECRET } = require("../utils/config");
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
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Not found" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(REQUEST_SUCCESSFUL).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Not Found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Incorrect email or password" });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};
