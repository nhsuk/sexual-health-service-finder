const links = require('../lib/postcodeLinks');

function results(req, res, next) {
  res.locals.services =
    links.addMapUrl(res.locals.postcodeLocationDetails, res.locals.services);
  res.locals.resultsInternalLink =
    links.addExternalUrl(res.locals.postcodeLocationDetails, res.locals.location);
  next();
}

module.exports = {
  results,
};
