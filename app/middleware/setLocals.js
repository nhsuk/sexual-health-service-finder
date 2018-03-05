const constants = require('../lib/constants');

function fromRequest(req, res, next) {
  res.locals.locationHeading = null;
  if ((req.query.type === constants.SERVICE_TYPES.professional)
      && ((req.query.origin === constants.SERVICE_CHOICES.symptoms)
        || (req.query.origin === constants.SERVICE_CHOICES.under16)
        || (req.query.origin === constants.SERVICE_CHOICES['16to25'])
        || (req.query.origin === constants.SERVICE_CHOICES.over25))) {
    res.locals.locationHeading = 'Where would you like to see a sexual health professional?';
  }
  if (req.query.type === constants.SERVICE_TYPES.kit) {
    if (req.query.origin === constants.SERVICE_CHOICES['16to25']) {
      res.locals.locationHeading = 'Where would you like to collect your free test kit?';
    } else if (req.query.origin === constants.SERVICE_CHOICES.over25) {
      res.locals.locationHeading = 'Where would you like to collect your test kit?';
    }
  }
  next();
}

module.exports = {
  fromRequest,
};
