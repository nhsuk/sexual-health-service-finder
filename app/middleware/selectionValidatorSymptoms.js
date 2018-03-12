const routeHelper = require('./routeHelper');

function symptomsSelection(req, res, next) {
  if (!res.locals.symptoms) {
    routeHelper.renderSymptomsWithError(req, res);
  } else if (res.locals.symptoms === 'no') {
    routeHelper.renderAgePage(req, res);
  } else {
    next();
  }
}

module.exports = symptomsSelection;
