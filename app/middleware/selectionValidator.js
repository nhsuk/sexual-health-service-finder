const messages = require('../lib/messages');
const routeHelper = require('./routeHelper');

function symptomsSelection(req, res, next) {
  if (!res.locals.symptoms) {
    routeHelper.renderSymptomsPage(req, res, messages.mandatorySelectionMessage());
  } else if (res.locals.symptoms === 'no') {
    routeHelper.renderAgePage(req, res);
  } else {
    next();
  }
}

module.exports = symptomsSelection;
