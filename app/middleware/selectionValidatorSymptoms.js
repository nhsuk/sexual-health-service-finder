const routeHelper = require('./routeHelper');
const constants = require('../lib/constants');

function symptomsSelection(req, res, next) {
  if (!res.locals.symptoms) {
    routeHelper.renderSymptomsWithError(req, res);
  } else if (res.locals.symptoms === constants.symptoms.no) {
    routeHelper.renderAgePage(req, res);
  } else {
    next();
  }
}

module.exports = symptomsSelection;
