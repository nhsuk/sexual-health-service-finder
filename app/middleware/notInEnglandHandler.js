const renderer = require('../middleware/renderer');
const warningCounter = require('../lib/prometheus/counters').outOfEnglandLocationWarnings;

function outsideEngland(countries) {
  return !countries.includes('England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.postcodeLocationDetails;

  if (location && outsideEngland(location.countries)) {
    warningCounter.inc(1);
    renderer.outsideOfEngland(req, res);
  } else {
    next();
  }
}

module.exports = notInEnglandHandler;
