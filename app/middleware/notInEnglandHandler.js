const renderer = require('../middleware/renderer');
const validationCounter = require('../lib/promCounters').validationLocationPageViews;

function outsideEngland(countries) {
  return !countries.includes('England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.postcodeLocationDetails;

  if (location && outsideEngland(location.countries)) {
    renderer.outsideOfEngland(req, res, location);
    validationCounter.inc(1);
  } else {
    next();
  }
}

module.exports = notInEnglandHandler;
