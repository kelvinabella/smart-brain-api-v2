const express = require("express");
const router = express.Router();
const Clarifai = require("clarifai");
const db = require("../db/postgres/postgres");
const { retrieveSession } = require("../authorization/authorization");

router.post("/clarifai", async (req, res, next) => {
  const { authorization } = req.headers;

  const session = await retrieveSession(authorization);
  if (!session.id) {
    return res.status(401).json(session);
  }

  try {
    const app = new Clarifai.App({
      apiKey: process.env.CLARIFAI_API_KEY,
    });

    const data = await app.models.predict(
      Clarifai.DEMOGRAPHICS_MODEL,
      req.body.input
    );
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: "Unable to process image." });
  }
});

router.put("/count", async (req, res, next) => {
  const { authorization } = req.headers;

  const session = await retrieveSession(authorization);
  if (!session.id && session.id != id) {
    return res.status(401).json(session);
  }

  try {
    const { id } = req.body;
    if (session.id != id) {
      return res.status(400).json({ error: "Wrong credentials." });
    }
    const entries = await db("users")
      .where("id", id)
      .increment("entries", 1)
      .returning("entries");
    return res.json(entries[0]);
  } catch (error) {
    return res.status(400).json({ error: "Unable to get entries count." });
  }
});

module.exports = router;
