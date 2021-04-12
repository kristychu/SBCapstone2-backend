"use strict";

/** Routes for users. */

// const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureLoggedInAndCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

//  router.post("/", ensureAdmin, async function (req, res, next) {
//     try {
//       const validator = jsonschema.validate(req.body, userNewSchema);
//       if (!validator.valid) {
//         const errs = validator.errors.map(e => e.stack);
//         throw new BadRequestError(errs);
//       }
  
//       const user = await User.register(req.body);
//       const token = createToken(user);
//       return res.status(201).json({ user, token });
//     } catch (err) {
//       return next(err);
//     }
//   });
  
  
  /** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
   *
   * Returns list of all users.
   *
   * Authorization required: none
   **/
  
  router.get("/", async function (req, res, next) {
    try {
      console.log('get all users')
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
  
  router.get("/:username", ensureLoggedInAndCorrectUser, async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** PATCH /[username] { user } => { user }
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Authorization required: logged in and same-user-as-:username
   **/
  
  // router.patch("/:username", ensureLoggedInAndCorrectUser, async function (req, res, next) {
  //   try {
  //     const validator = jsonschema.validate(req.body, userUpdateSchema);
  //     if (!validator.valid) {
  //       const errs = validator.errors.map(e => e.stack);
  //       throw new BadRequestError(errs);
  //     }
  
  //     const user = await User.update(req.params.username, req.body);
  //     return res.json({ user });
  //   } catch (err) {
  //     return next(err);
  //   }
  // });
  
  
  /** DELETE /[username]  =>  { deleted: username }
   *
   * Authorization required: admin or same-user-as-:username
   **/
  
//   router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
//     try {
//       await User.remove(req.params.username);
//       return res.json({ deleted: req.params.username });
//     } catch (err) {
//       return next(err);
//     }
//   });
  
  
  module.exports = router;