const Item = require("../models/clothingItemsMod");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  REQUEST_SUCCESSFUL,
  REQUEST_CREATED,
} = require("../utils/errorCodes");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(REQUEST_SUCCESSFUL).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An internal server error has occured." });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(REQUEST_CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data entry" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An internal server error has occured." });
    });
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then(() =>
      res
        .status(REQUEST_SUCCESSFUL)
        .send({ message: "Item successfully deleted" })
    )
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User ID not found" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID used" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An internal server error has occured." });
    });
};

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(REQUEST_CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID used" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item ID not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An internal server error has occured." });
    });
};

module.exports.deleteLike = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send(item))
    .catch((err) => {
      console.error(err);
      console.log("CRASH HERE");
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item ID not found" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid User ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An internal server error has occured." });
    });
};
