const routeHelper = require('./routeHelper');
const constants = require('../lib/constants');

function chooseSelection(req, res, next) {
  if (!res.locals.type) {
    if (!res.locals.origin) {
      routeHelper.renderStartPageWithError(req, res);
    } else {
      routeHelper.renderChoosePageWithError(req, res);
    }
  } else if (res.locals.type === constants.serviceTypes.professional) {
    routeHelper.renderLocationPage(req, res);
  } else if (res.locals.type === constants.serviceTypes.kit) {
    routeHelper.renderLocationPage(req, res);
  } else if (res.locals.type === constants.serviceTypes.online) {
    routeHelper.renderOnlinePage(req, res);
  } else {
    next();
  }
}

module.exports = chooseSelection;
