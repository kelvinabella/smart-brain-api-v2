const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ home: "This is index route." });
});

module.exports = router;
