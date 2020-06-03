const jwt = require("jsonwebtoken");
const redisClient = require("../db/redis/redis");

const createToken = (userName) => {
  const jwtPayload = { userName };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "24h" });
};

const createSession = (user) => {
  const { email, id } = user;
  const token = createToken(email);
  redisClient.set(token, id);
  return token;
};

const removeSession = (token) => {
  if (!token) {
    return { error: "Unauthorized" };
  }

  return new Promise((resolve, reject) => {
    redisClient.del(token.replace("Bearer ", ""), (err, reply) => {
      if (err || !reply) resolve({ error: "Unauthorized" });
      resolve({ message: "Success" });
    });
  });
};

const retrieveSession = (token) => {
  if (!token) {
    return { error: "Unauthorized" };
  }

  return new Promise((resolve, reject) => {
    redisClient.get(token.replace("Bearer ", ""), (err, reply) => {
      if (err || !reply) resolve({ error: "Unauthorized" });
      resolve({ id: reply });
    });
  });
};

module.exports = {
  createSession,
  retrieveSession,
  removeSession,
};
