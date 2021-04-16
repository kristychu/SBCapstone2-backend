"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Step = require("../models/step");
const { createToken } = require("../helpers/tokens");

const testStepIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM step");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    profileImg: "profileimguser1link",
  });

  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    profileImg: "profileimguser2link",
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    profileImg: "profileimguser3link",
  });

  testStepIds[0] = (
    await Step.create("u1", {
      routineStep: "Makeup Remover and Oil Cleanser",
      timeOfDay: "morning",
      productId: 1,
    })
  ).stepId;
  testStepIds[1] = (
    await Step.create("u1", {
      routineStep: "Water Based Cleanser",
      timeOfDay: "morning",
      productId: 23,
    })
  ).stepId;
  testStepIds[2] = (
    await Step.create("u2", {
      routineStep: "Makeup Remover and Oil Cleanser",
      timeOfDay: "night",
      productId: 80,
    })
  ).stepId;
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

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  testStepIds,
};
