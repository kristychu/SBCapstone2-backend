"use strict";

// read .env files and make environmental variables

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const PORT = +process.env.PORT || 3001;

const REACT_APP_BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "postgresql:///skincare_test"
    : process.env.DATABASE_URL || "postgresql:///skincare";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  REACT_APP_BASE_URL,
  getDatabaseUri,
};
