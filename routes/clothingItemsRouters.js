const router = require("express").Router();

router.get("/", () => console.log("GET clothing items"));

router.post("/", () => console.log("POST clothing item"));

router.delete("/:itemId", () => console.log("DELETE clothing item by _id"));

module.exports = router;
