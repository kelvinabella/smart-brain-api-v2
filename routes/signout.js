const express = require("express");
const router = express.Router();
const { removeSession } = require("../authorization/authorization");

router.post("/1", async (req, res, next) => {
  const { authorization } = req.headers;

  const session = await removeSession(authorization);
  if (!session.message) {
    return res.status(401).json(session);
  }
  return res.json(session);
});

module.exports = router;
