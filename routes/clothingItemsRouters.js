const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
} = require("../controllers/clothingItemsCon");

router.get("/", getItems);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", deleteLike);

module.exports = router;
