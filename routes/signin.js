const express = require("express");
const router = express.Router();
const bcrpyt = require("bcryptjs");
const db = require("../db/postgres/postgres");
const {
  retrieveSession,
  createSession,
} = require("../authorization/authorization");

/* Sign in user. */
router.post("/", async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const session = await retrieveSession(authorization);
    if (!session.id) {
      return res.status(401).json(session);
    }
    return res.json(session);
  } else {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    try {
      const loginDetails = await db
        .select("email", "hash")
        .from("login")
        .where("email", email);

      const isValid = bcrpyt.compareSync(password, loginDetails[0].hash);

      if (!isValid) {
        return res.status(400).json({ error: "Wrong credentials." });
      }

      const userDetails = await db("users")
        .where("email", email)
        .catch(() => {
          res.status(400).json({ error: "Unable to get user." });
        });

      const user = userDetails[0];
      const token = createSession(user);

      return res.json({ token, user: user });
    } catch (error) {
      return res.status(400).json({ error: "Wrong credentials." });
    }
  }
});

module.exports = router;
