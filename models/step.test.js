"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Step = require("./step.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testStepIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  let user1 = "u1";
  let newStep = {
    routineStep: "Exfoliator",
    timeOfDay: "morning",
    productId: 1,
  };

  test("works", async function () {
    let step = await Step.create(user1, newStep);
    expect(step).toEqual({
      stepId: expect.any(Number),
      username: "u1",
      routineStep: "Exfoliator",
      timeOfDay: "morning",
      productId: 1,
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: for 1 user", async function () {
    let user1 = "u1";
    let steps = await Step.findAll(user1);
    expect(steps).toEqual([
      {
        id: testStepIds[0],
        username: "u1",
        routineStep: "Makeup Remover and Oil Cleanser",
        timeOfDay: "morning",
        productId: 1,
      },
      {
        id: testStepIds[1],
        username: "u1",
        routineStep: "Water Based Cleanser",
        timeOfDay: "morning",
        productId: 3,
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let step = await Step.get(testStepIds[0]);
    expect(step).toEqual({
      stepId: testStepIds[0],
      username: "u1",
      routineStep: "Makeup Remover and Oil Cleanser",
      timeOfDay: "morning",
      productId: 1,
    });
  });

  test("not found if no such job", async function () {
    try {
      await Step.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    product_id: 47,
  };

  test("works", async function () {
    let step = await Step.update(testStepIds[0], updateData);
    expect(step).toEqual({
      stepId: testStepIds[0],
      username: "u1",
      routineStep: "Makeup Remover and Oil Cleanser",
      timeOfDay: "morning",
      productId: 47,
    });
  });

  test("not found if no such job", async function () {
    try {
      await Step.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Step.update(testStepIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Step.remove(testStepIds[2]);
    const res = await db.query(
      `SELECT id FROM step WHERE id=${testStepIds[2]}`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Step.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
