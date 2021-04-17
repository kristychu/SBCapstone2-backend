"use strict";

/** Routes for skincare steps. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedInAndCorrectUser } = require("../middleware/auth");
const Step = require("../models/step");

const { allMorningSteps, allNightSteps } = require("../helpers/initStepData");
const { updateUserStepData } = require("../helpers/updateStepData");

const stepNewSchema = require("../schemas/stepNew.json");
const stepUpdateSchema = require("../schemas/stepUpdate.json");

const router = new express.Router();

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
      const updatedMorningSteps = updateUserStepData(
        allMorningSteps,
        savedSteps
      );
      const updatedNightSteps = updateUserStepData(allNightSteps, savedSteps);
      const allSteps = [updatedMorningSteps, updatedNightSteps];
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
