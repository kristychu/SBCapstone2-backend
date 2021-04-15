"use strict";

/** Routes for users. */

const express = require("express");
const { ensureLoggedInAndCorrectUser } = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: none
 **/

router.get("/", async function (req, res, next) {
  try {
    console.log("get all users");
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, first_name, last_name, email, profile_img, steps }
 *   where steps is { id, routine_step, time_of_day, product_id }
 *
 * Authorization required: logged in and same user-as-:username
 **/

router.get(
  "/:username",
  ensureLoggedInAndCorrectUser,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
