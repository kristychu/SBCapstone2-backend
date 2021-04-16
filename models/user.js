"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, profile_img }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              profile_img AS "profileImg"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, profileImg }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    profileImg,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (username,
                          password,
                          first_name,
                          last_name,
                          email,
                          profile_img)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  profile_img AS "profileImg"`,
      [username, hashedPassword, firstName, lastName, email, profileImg]
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  profile_img AS "profileImg"
           FROM users
           ORDER BY username`
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, email, profile_img, steps }
   *   where steps is { id, routine_step, time_of_day, product_id }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              profile_img AS "profileImg"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userStepsRes = await db.query(
      `SELECT s.id,
              s.routine_step AS "routineStep",
              s.time_of_day AS "timeOfDay",
              s.product_id AS "productId"
        FROM step AS s
        WHERE s.username = $1`,
      [username]
    );

    user.steps = userStepsRes.rows.map((s) => s.id);
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, profileImg }
   *
   * Returns { username, firstName, lastName, email, profileImg }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      profileImg: "profile_img",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                    SET ${setCols} 
                    WHERE username = ${usernameVarIdx} 
                    RETURNING username,
                              first_name AS "firstName",
                              last_name AS "lastName",
                              email,
                              profile_img AS "profileImg"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
         FROM users
         WHERE username = $1
         RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
