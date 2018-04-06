const links = require('../lib/externalUrlGenerator');

function results(req, res, next) {
  const locationDetails = res.locals.postcodeLocationDetails;
  res.locals.services = links.addMapUrl(locationDetails, res.locals.services);
  res.locals.resultsExternalUrl =
    links.getChoicesResultsUrlToOnlineTests(locationDetails, res.locals.location);
  next();
}

module.exports = {
  results,
};
