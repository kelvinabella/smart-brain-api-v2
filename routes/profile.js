const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const { retrieveSession } = require("../authorization/authorization");

router.get("/:id", async (req, res, next) => {
  const { authorization } = req.headers;

  const session = await retrieveSession(authorization);
  if (!session.id) {
    return res.status(401).json(session);
  }

  try {
    const { id } = req.params;
    const user = await db.select().from("users").where({ id });
    if (user.length > 0 && session.id == id) {
      return res.json(user[0]);
    }

    return res.status(400).json({ error: "User not found." });
  } catch (error) {
    return res.status(400).json({ error: "Error getting user." });
  }
});

router.post("/:id", async (req, res, next) => {
  const { authorization } = req.headers;

  const session = await retrieveSession(authorization);
  if (!session.id) {
    return res.status(401).json(session);
  }

  try {
    const { id } = req.params;
    const { name, gender, age, address } = req.body.formInput;

    if (session.id != id) {
      return res.status(400).json({ error: "User not found." });
    }

    const output = await db("users")
      .where({ id })
      .update({ name, gender, age, address });
    if (output) {
      return res.json({ message: "Success" });
    }

    return res.status(400).json({ error: "User not found." });
  } catch (error) {
    return res.status(400).json({ "error:": "Error updating user." });
  }
});

module.exports = router;
