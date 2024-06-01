const router = require("express").Router();
const userRouter = require("./usersRouters");
const clothingItemsRouter = require("./clothingItemsRouters");

router.use("/users", userRouter);

router.use("/items", clothingItemsRouter);

module.exports = router;
