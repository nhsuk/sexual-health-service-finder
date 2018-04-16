const emptySearchErrors = require('../lib/prometheus/counters').emptySearchLocationErrors;
const renderer = require('../middleware/renderer');

function validateLocation(req, res, next) {
  if (!(res.locals.location)) {
    emptySearchErrors.inc(1);
    renderer.emptyPostcode(req, res);
  } else {
    next();
  }
}

module.exports = validateLocation;
