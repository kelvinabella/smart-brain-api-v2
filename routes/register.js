const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db/postgres/postgres");
const { createSession } = require("../authorization/authorization");

/* Register user. */
router.post("/", async (req, res, next) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  try {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    await db.transaction(async (trx) => {
      const loginDetails = await db("login").where({ email });

      if (loginDetails.length > 0) {
        return res.status(400).json({ error: "User already registered." });
      }

      const userEmail = await trx("login")
        .insert({ hash, email })
        .returning("email");

      const userDetails = await trx("users")
        .insert({
          name,
          email: userEmail[0],
          gender: "",
          age: 0,
          address: "",
          joined: new Date(),
        })
        .returning("*");

      const user = userDetails[0];
      const token = createSession(user);

      return res.json({ token, user: user });
    });
  } catch (error) {
    return res.status(400).json({ error: "Unable to register." });
  }
});

module.exports = router;
