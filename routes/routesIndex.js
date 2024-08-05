const router = require("express").Router();
const userRouter = require("./usersRouters");
const clothingItemsRouter = require("./clothingItemsRouters");
const signInRouter = require("./signInRouter");

const { NOT_FOUND } = require("../utils/errorCodes");

router.use("/users", userRouter);

router.use("/items", clothingItemsRouter);

router.use("/", signInRouter);

router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Resource not found" })
);

module.exports = router;
