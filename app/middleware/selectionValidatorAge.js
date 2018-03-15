const routeHelper = require('./routeHelper');

function ageSelection(req, res, next) {
  if (!res.locals.age) {
    routeHelper.renderAgePageWithError(req, res);
  } else if (res.locals.age === '1') {
    routeHelper.renderSeeExpertUnder16Page(req, res);
  } else {
    next();
  }
}

module.exports = ageSelection;
