"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for skincare steps. */

class Step {
  /** Create a skincare step (from data), update db, return new skincare step data.
   *
   * data should be { username, routineStep, timeOfDay, productId }
   *
   * Returns { username, routine_step, time_of_day, product_id }
   *
   * Throws BadRequestError if step already in database.
   * */

  static async create(username, { routineStep, timeOfDay, productId }) {
    const duplicateCheck = await db.query(
      `SELECT username,
                    routine_step AS "routineStep",
                    time_of_day AS "timeOfDay"
             FROM step
             WHERE username = $1 AND routine_step = $2 AND time_of_day = $3`,
      [username, routineStep, timeOfDay]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `Duplicate ${timeOfDay} routine step: ${routineStep} for ${username}`
      );

    const result = await db.query(
      `INSERT INTO step (username,
                                routine_step,
                                time_of_day,
                                product_id)
            VALUES ($1, $2, $3, $4)
            RETURNING username, routine_step AS "routineStep", time_of_day AS "timeOfDay",
                    product_id AS "productId", id AS "stepId"`,
      [username, routineStep, timeOfDay, productId]
    );
    let step = result.rows[0];

    return step;
  }

  /** Find all skincare steps for a user.
   *
   * Returns [{ id, username, routine_step, time_of_day, product_id }, ...]
   * */

  static async findAll(username) {
    let result = await db.query(
      `SELECT id,
                        username,
                        routine_step AS "routineStep",
                        time_of_day AS "timeOfDay",
                        product_id AS "productId"
                FROM step
                WHERE username = $1
                ORDER BY time_of_day`,
      [username]
    );

    return result.rows;
  }

  /** Given a step id, return data about specific skincare step.
   *
   * Returns { id, username, routine_step, time_of_day, product_id }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const stepRes = await db.query(
      `SELECT id,
                            username,
                            routine_step AS "routineStep",
                            time_of_day AS "timeOfDay",
                            product_id AS "productId"
                    FROM step
                    WHERE id = $1`,
      [id]
    );

    const step = stepRes.rows[0];

    if (!step) throw new NotFoundError(`No routine step id: ${id}`);

    return step;
  }

  /** Update skincare step data with `data` for user.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { productId }
   *
   * Returns {username, routine_step, time_of_day, product_id }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      productId: "product_id",
    });
    const stepIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE step 
                      SET ${setCols} 
                      WHERE id = ${stepIdVarIdx}
                      RETURNING username,
                                routine_step AS "routineStep",
                                time_of_day AS "timeOfDay",
                                product_id AS "productId"`;
    const result = await db.query(querySql, [...values, id]);
    const step = result.rows[0];

    if (!step) throw new NotFoundError(`No routine step id: ${id}`);

    return step;
  }

  /** Delete given step from database; returns undefined.
   *
   * Throws NotFoundError if step not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM step
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const step = result.rows[0];

    if (!step) throw new NotFoundError(`No routine step id: ${id}`);
  }
}

module.exports = Step;
