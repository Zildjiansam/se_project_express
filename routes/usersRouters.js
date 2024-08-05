const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { updateUser, getCurrentUser } = require("../controllers/usersCon");

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateUser);

module.exports = router;
