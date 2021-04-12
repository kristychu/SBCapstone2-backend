"use strict";

/** Routes for skincare steps. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedInAndCorrectUser } = require("../middleware/auth");
const Step = require("../models/step");

const stepNewSchema = require("../schemas/stepNew.json");
const stepUpdateSchema = require("../schemas/stepUpdate.json");

const router = new express.Router();

const allMorningSteps = [
  {
    stepNumber: 0,
    routineStep: "Makeup Remover and Oil Cleanser",
    timeOfDay: "morning",
    productId: null,
    stepId: null,
  },
  {
    stepNumber: 1,
    routineStep: "Water Based Cleanser",
    timeOfDay: "morning",
    productId: null,
    stepId: null,
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
];

const allNightSteps = [
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
];

/** POST /[username] { step } =>  { step }
 *
 * step should be { username, routineStep, timeOfDay, productId }
 *
 * Returns { username, routineStep, timeOfDay, productId }
 *
 * Authorization required: logged in and same-user-as-:username
 */

router.post(
  "/:username",
  ensureLoggedInAndCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, stepNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const step = await Step.create(req.params.username, req.body);
      return res.status(201).json({ step });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]  =>
 *   { steps: [ { username, routineStep, timeOfDay, productId }, ...] }
 *
 * Returns all skincare steps for 1 user
 *
 * Authorization required: logged in and same-user-as-:username
 */

router.get(
  "/:username",
  ensureLoggedInAndCorrectUser,
  async function (req, res, next) {
    try {
      const savedSteps = await Step.findAll(req.params.username);
      for (let i = 0; i < allMorningSteps.length; i++) {
        const filteredSteps = savedSteps.filter(
          (savedStep) =>
            allMorningSteps[i].routineStep === savedStep.routineStep &&
            allMorningSteps[i].timeOfDay === savedStep.timeOfDay
        );
        if (filteredSteps.length > 1) throw Error;
        if (filteredSteps.length === 1) {
          allMorningSteps[i].productId = filteredSteps[0].productId;
          allMorningSteps[i].stepId = filteredSteps[0].id;
        }
      }
      for (let i = 0; i < allNightSteps.length; i++) {
        const filteredSteps = savedSteps.filter(
          (savedStep) =>
            allNightSteps[i].routineStep === savedStep.routineStep &&
            allNightSteps[i].timeOfDay === savedStep.timeOfDay
        );
        if (filteredSteps.length > 1) throw Error;
        if (filteredSteps.length === 1) {
          allNightSteps[i].productId = filteredSteps[0].productId;
          allNightSteps[i].stepId = filteredSteps[0].id;
        }
      }
      const allSteps = [allMorningSteps, allNightSteps];
      return res.json({ steps: allSteps });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/[stepId]  =>  { step }
 *
 *  Step is { id, username, routineStep, timeOfDay, productId }
 *
 * Returns skincare step details for 1 step
 *
 * Authorization required: logged in
 */

router.get(
  "/:username/:id",
  ensureLoggedInAndCorrectUser,
  async function (req, res, next) {
    try {
      const step = await Step.get(+req.params.id);
      return res.json({ step });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username]/[stepId] { fld1, fld2, ... } => { step }
 *
 * Patches skincare step data.
 *
 * fields can be: { username, routineStep, timeOfDay, productId }
 *
 * Returns { username, routineStep, timeOfDay, productId }
 *
 * Authorization required: logged in and same-user-as-:username
 */

router.patch(
  "/:username/:id",
  ensureLoggedInAndCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, stepUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const step = await Step.update(req.params.id, req.body);
      return res.json({ step });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: logged in and same-user-as-:username
 */

router.delete(
  "/:username/:id",
  ensureLoggedInAndCorrectUser,
  async function (req, res, next) {
    try {
      await Step.remove(+req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
