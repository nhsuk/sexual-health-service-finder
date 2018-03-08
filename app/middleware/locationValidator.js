const renderer = require('../middleware/renderer');

function validateLocation(req, res, next) {
  const postcodeSearch = res.locals.location;

  if (!(postcodeSearch)) {
    renderer.emptyPostcodePage(req, res);
  } else {
    next();
  }
}

module.exports = validateLocation;
