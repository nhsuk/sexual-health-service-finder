const messages = require('../lib/messages');
const routeHelper = require('./routeHelper');

function sympmtomsSelection(req, res, next) {
  if (!res.locals.symptoms) {
    routeHelper.renderSymptomsPage(req, res, messages.mandatorySelectionMessage());
  } else {
    next();
  }
}

module.exports = sympmtomsSelection;
