"use strict";

const request = require("supertest");

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

/************************************** POST /steps/:username */

describe("POST /steps/:username", function () {
  test("ok for same user", async function () {
    const resp = await request(app)
      .post(`/api/steps/u1`)
      .send({
        routineStep: "Exfoliator",
        timeOfDay: "morning",
        productId: 98,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      step: {
        stepId: expect.any(Number),
        username: "u1",
        routineStep: "Exfoliator",
        timeOfDay: "morning",
        productId: 98,
      },
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/api/steps/u1")
      .send({
        routineStep: "Exfoliator",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/api/steps/u1")
      .send({
        routineStep: "Exfoliator",
        timeOfDay: "morning",
        productId: "not-a-number",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /steps/:username */

describe("GET /steps/:username", function () {
  test("ok for same user", async function () {
    const resp = await request(app)
      .get("/api/steps/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      steps: [
        [
          {
            stepId: testStepIds[0],
            routineStep: "Makeup Remover and Oil Cleanser",
            timeOfDay: "morning",
            productId: 1,
            stepNumber: 0,
          },
          {
            stepId: testStepIds[1],
            routineStep: "Water Based Cleanser",
            timeOfDay: "morning",
            productId: 23,
            stepNumber: 1,
          },
          {
            stepNumber: 2,
            routineStep: "Exfoliator",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 3,
            routineStep: "Toner",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 4,
            routineStep: "Essence",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 5,
            routineStep: "Treatments",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 6,
            routineStep: "Sheet Masks",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 7,
            routineStep: "Eye Cream",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 8,
            routineStep: "Moisturizer",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 9,
            routineStep: "Sun Protection",
            timeOfDay: "morning",
            productId: null,
            stepId: null,
          },
        ],
        [
          {
            stepNumber: 11,
            routineStep: "Makeup Remover and Oil Cleanser",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 12,
            routineStep: "Water Based Cleanser",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 13,
            routineStep: "Exfoliator",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 14,
            routineStep: "Toner",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 15,
            routineStep: "Essence",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 16,
            routineStep: "Treatments",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 17,
            routineStep: "Sheet Masks",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 18,
            routineStep: "Eye Cream",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
          {
            stepNumber: 19,
            routineStep: "Moisturizer",
            timeOfDay: "night",
            productId: null,
            stepId: null,
          },
        ],
      ],
    });
  });
});

/************************************** GET /steps/:username/:stepId */

describe("GET /steps/:username/:stepId", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/api/steps/u1/${testStepIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      step: {
        id: testStepIds[0],
        username: "u1",
        routineStep: "Makeup Remover and Oil Cleanser",
        timeOfDay: "morning",
        productId: 1,
      },
    });
  });

  test("not found for no such step", async function () {
    const resp = await request(app).get(`/api/steps/u1/nope`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /steps/:username/:stepId */

describe("PATCH /steps/:username/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .patch(`/api/steps/u1/${testStepIds[1]}`)
      .send({
        productId: 42,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      step: {
        username: "u1",
        routineStep: "Water Based Cleanser",
        timeOfDay: "morning",
        productId: 42,
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/api/steps/u1/${testStepIds[1]}`)
      .send({
        productId: 42,
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such step", async function () {
    const resp = await request(app)
      .patch(`/api/steps/u1/nope`)
      .send({
        productId: 42,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });

  test("bad request on id change attempt", async function () {
    const resp = await request(app)
      .patch(`/api/steps/u1/${testStepIds[1]}`)
      .send({
        id: 28,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/api/steps/u1/${testStepIds[1]}`)
      .send({
        productId: "Twelve",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /steps/:username/:id */

describe("DELETE /steps/:username/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/api/steps/u2/${testStepIds[2]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: `${testStepIds[2]}` });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/api/steps/u2/${testStepIds[1]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for different user", async function () {
    const resp = await request(app)
      .delete(`/api/steps/u1/${testStepIds[0]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such step", async function () {
    const resp = await request(app)
      .delete(`/api/steps/u1/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});
