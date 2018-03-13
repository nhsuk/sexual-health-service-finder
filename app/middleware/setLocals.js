const constants = require('../lib/constants');

function getLocationHeading(query) {
  if ((query.type === constants.SERVICE_TYPES.professional)
    && ((query.origin === constants.SERVICE_CHOICES.symptoms)
      || (query.origin === constants.SERVICE_CHOICES.under16)
      || (query.origin === constants.SERVICE_CHOICES['16to25'])
      || (query.origin === constants.SERVICE_CHOICES.over25))) {
    return 'Where would you like to see a sexual health professional?';
  }
  if (query.type === constants.SERVICE_TYPES.kit) {
    if (query.origin === constants.SERVICE_CHOICES['16to25']) {
      return 'Where would you like to collect your free test kit?';
    } else if (query.origin === constants.SERVICE_CHOICES.over25) {
      return 'Where would you like to collect your test kit?';
    }
  }
  return null;
}

function fromRequest(req, res, next) {
  res.locals.locationHeading = null;
  res.locals.locationLabel = 'Enter a postcode in England.';
  res.locals.type = req.query.type;
  res.locals.origin = req.query.origin;
  res.locals.location = req.query.location;
  res.locals.locationHeading = getLocationHeading(req.query);
  res.locals.correctParams = res.locals.locationHeading;
  next();
}

module.exports = {
  fromRequest,
  getLocationHeading,
};
