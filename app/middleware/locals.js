const constants = require('../lib/constants');

function getLocationHeading(query) {
  if (query.type) {
    if ((query.type.localeCompare(constants.SERVICE_TYPES.professional, 'en', { sensitivity: 'base' }) === 0)
      && ((query.origin === constants.SERVICE_CHOICES.symptoms)
        || (query.origin === constants.SERVICE_CHOICES.under16)
        || (query.origin === constants.SERVICE_CHOICES['16to25'])
        || (query.origin === constants.SERVICE_CHOICES.over25))) {
      return 'Where would you like to see a sexual health professional?';
    }
    if (query.type.localeCompare(constants.SERVICE_TYPES.kit, 'en', { sensitivity: 'base' }) === 0) {
      if (query.origin === constants.SERVICE_CHOICES['16to25']) {
        return 'Where would you like to collect your free test kit?';
      } else if (query.origin === constants.SERVICE_CHOICES.over25) {
        return 'Where would you like to collect your test kit?';
      }
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

// eslint-disable-next-line no-unused-vars
module.exports = config =>
  (req, res, next) => {
    res.locals.GOOGLE_ANALYTICS_TRACKING_ID = config.googleAnalyticsId;
    res.locals.WEBTRENDS_ANALYTICS_TRACKING_ID = config.webtrendsId;
    res.locals.HOTJAR_ANALYTICS_TRACKING_ID = config.hotjarId;
    res.locals.SITE_ROOT = req.app.locals.SITE_ROOT;
    res.locals.ASSETS_URL = req.app.locals.ASSETS_URL;
    res.locals.symptoms = req.query.symptoms;
    res.locals.age = req.query.age;
    res.locals.type = mapServiceType(req.query);
    res.locals.origin = mapServiceChoice(req.query);
    res.locals.req_location = req.query.location;
    res.locals.location = req.query.location;
    res.locals.locationHeading = getLocationHeading(req.query);
    res.locals.correctLocationParams = res.locals.locationHeading;
    next();
  };
