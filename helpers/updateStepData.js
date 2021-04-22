const { BadRequestError } = require("../expressError");
const lodash = require("lodash");

//helper function when user logs in to update initStepData with user's saved step data

function updateUserStepData(currentSteps, userSteps) {
  if (userSteps.length === 0) {
    return currentSteps;
  } else {
    let initSteps = lodash.cloneDeep(currentSteps);
    for (let i = 0; i < initSteps.length; i++) {
      const filteredSteps = userSteps.filter(
        (userStep) =>
          initSteps[i].routineStep === userStep.routineStep &&
          initSteps[i].timeOfDay === userStep.timeOfDay
      );
      if (filteredSteps.length > 1)
        throw new BadRequestError(
          `Found multiple saved routine steps with same routine step name for user`
        );
      if (filteredSteps.length === 1) {
        initSteps[i].productId = filteredSteps[0].productId;
        initSteps[i].stepId = filteredSteps[0].stepId;
      }
    }
    return initSteps;
  }
}

module.exports = { updateUserStepData };
