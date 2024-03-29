"use strict";

/** Express app for skincare app. */

const express = require("express");
const cors = require("cors");
const path = require("path");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const stepsRoutes = require("./routes/steps");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);

app.options("*", cors());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/steps", stepsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
