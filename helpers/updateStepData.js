const { BadRequestError } = require("../expressError");

function updateUserStepData(blankSteps, userSteps) {
  for (let i = 0; i < blankSteps.length; i++) {
    const filteredSteps = userSteps.filter(
      (userStep) =>
        blankSteps[i].routineStep === userStep.routineStep &&
        blankSteps[i].timeOfDay === userStep.timeOfDay
    );
    if (filteredSteps.length > 1)
      throw new BadRequestError(
        `Found multiple saved routine steps with same routine step name for user`
      );
    if (filteredSteps.length === 1) {
      blankSteps[i].productId = filteredSteps[0].productId;
      blankSteps[i].stepId = filteredSteps[0].id;
    }
  }
  return blankSteps;
}

module.exports = { updateUserStepData };
