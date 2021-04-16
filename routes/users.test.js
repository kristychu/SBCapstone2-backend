"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  testStepIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */

describe("GET /users", function () {
  test("works for users", async function () {
    const resp = await request(app)
      .get("/api/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
          profileImg: "profileimguser1link",
        },
        {
          username: "u2",
          firstName: "U2F",
          lastName: "U2L",
          email: "user2@user.com",
          profileImg: "profileimguser2link",
        },
        {
          username: "u3",
          firstName: "U3F",
          lastName: "U3L",
          email: "user3@user.com",
          profileImg: "profileimguser3link",
        },
      ],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/api/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. Deleting the table
    // should definitely cause an error.
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/api/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for users if they are correct user", async function () {
    const resp = await request(app)
      .get(`/api/users/u2`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "user2@user.com",
        profileImg: "profileimguser2link",
        steps: [testStepIds[2]],
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/api/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/api/users/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
