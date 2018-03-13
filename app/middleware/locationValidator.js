const renderer = require('../middleware/renderer');

function validateLocation(req, res, next) {
  if (!(res.locals.location)) {
    renderer.emptyPostcode(req, res);
  } else {
    next();
  }
}

module.exports = validateLocation;
