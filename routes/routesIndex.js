const { SERVER_ERROR } = require("../utils/errorCodes");

const router = require("express").Router();
const userRouter = require("./usersRouters");
const clothingItemsRouter = require("./clothingItemsRouters");

router.use("/users", userRouter);

router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  return res.status(SERVER_ERROR).send({ message: "Resource not found" });
});

module.exports = router;
