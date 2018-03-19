const constants = require('../constants');

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
    if (query.type.localeCompare(constants.SERVICE_TYPES.online, 'en', { sensitivity: 'base' }) === 0) {
      return 'redirect';
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
  if ((query.age) && (query.age === constants.AGE['16to25'])) {
    return constants.SERVICE_CHOICES['16to25'];
  }
  if ((query.age) && (query.age === constants.AGE.over25)) {
    return constants.SERVICE_CHOICES.over25;
  }
  return undefined;
}

module.exports = {
  getLocationHeading,
  mapServiceChoice,
  mapServiceType,
};
