const renderer = require('../middleware/renderer');

function outsideEngland(countries) {
  return !countries.includes('England');
}

function notInEnglandHandler(req, res, next) {
  const location = res.locals.postcodeLocationDetails;

  if (location && outsideEngland(location.countries)) {
    renderer.outsideOfEnglandPage(location, req, res);
  } else {
    next();
  }
}

module.exports = notInEnglandHandler;
