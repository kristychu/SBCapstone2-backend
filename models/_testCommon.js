const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testStepIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM step");

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          profile_img)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', 'profileimguser1link'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', 'profileimguser2link')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  const steps = await db.query(`
        INSERT INTO step (username, routine_step, time_of_day, product_id)
        VALUES ('u1', 'Makeup Remover and Oil Cleanser', 'morning', 1),
              ('u1', 'Water Based Cleanser', 'morning', 3),
              ('u2', 'Exfoliator', 'morning', 20),
              ('u2', 'Toner', 'morning', 31)
        RETURNING id`);
  testStepIds.splice(0, 0, ...steps.rows.map((r) => r.id));
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testStepIds,
};
