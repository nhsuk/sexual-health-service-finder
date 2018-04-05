const routeHelper = require('./routeHelper');
const constants = require('../lib/constants');

function ageSelection(req, res, next) {
  if (!res.locals.age) {
    routeHelper.renderAgePageWithError(req, res);
  } else if (res.locals.age === constants.age.under16) {
    routeHelper.renderSeeExpertUnder16Page(req, res);
  } else if (res.locals.age === constants.age['16to24']) {
    routeHelper.renderChooseTestUnder25Page(req, res);
  } else if (res.locals.age === constants.age.over25) {
    routeHelper.renderChooseTestOver25Page(req, res);
  } else {
    next();
  }
}

module.exports = ageSelection;
