const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const signInRouter = require("./routes/signin");
const signOutRouter = require("./routes/signout");
const profileRouter = require("./routes/profile");
const imageRouter = require("./routes/image");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/signin", signInRouter);
app.use("/signout", signOutRouter);
app.use("/profile", profileRouter);
app.use("/image", imageRouter);

module.exports = app;
