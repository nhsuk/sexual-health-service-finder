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
  return undefined;
}

function mapServiceType(query) {
  if (query.type) {
    return query.type;
  }
  if (((query.age) && (query.age === constants.AGE.under16))
      || ((query.symptoms) && (query.symptoms === constants.SYMPTOMS.yes))) {
    return constants.SERVICE_TYPES.professional;
  }
  return undefined;
}

function mapServiceChoice(query) {
  if (query.origin) {
    return query.origin;
  }
  if ((query.age) && (query.age === constants.AGE.under16)) {
    return constants.SERVICE_CHOICES.under16;
  }
  if ((query.symptoms) && (query.symptoms === constants.SYMPTOMS.yes)) {
    return constants.SERVICE_CHOICES.symptoms;
  }
  return undefined;
}

function fromRequest(req, res, next) {
  res.locals.locationHeading = null;
  res.locals.locationLabel = 'Enter a postcode in England.';
  res.locals.symptoms = req.query.symptoms;
  res.locals.age = req.query.age;
  res.locals.type = mapServiceType(req.query);
  res.locals.origin = mapServiceChoice(req.query);
  res.locals.location = req.query.location;
  res.locals.locationHeading = getLocationHeading(req.query);
  res.locals.correctLocationParams = res.locals.locationHeading;

  next();
}

module.exports = {
  fromRequest,
  getLocationHeading,
  mapServiceType,
  mapServiceChoice,
};
