const mapLink = require('../lib/mapLink');

function results(req, res, next) {
  res.locals.services = mapLink.addUrl(res.locals.postcodeLocationDetails, res.locals.services);
  next();
}

module.exports = {
  results,
};
