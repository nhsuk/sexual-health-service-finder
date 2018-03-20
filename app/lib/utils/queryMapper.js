const constants = require('../constants');
const comparisons = require('./comparisons');

function getLocationHeading(query) {
  if (query.type) {
    if ((comparisons.areEqual(query.type, constants.serviceTypes.professional))
      && (comparisons.getValues(constants.serviceChoices).includes(query.origin))) {
      return 'Where would you like to see a sexual health professional?';
    }
    if (comparisons.areEqual(query.type, constants.serviceTypes.kit)) {
      if (query.origin === constants.serviceChoices['16to25']) {
        return 'Where would you like to collect your free test kit?';
      } else if (query.origin === constants.serviceChoices.over25) {
        return 'Where would you like to collect your test kit?';
      }
    }
    if (comparisons.areEqual(query.type, constants.serviceTypes.online)) {
      return 'redirect';
    }
  }
  return undefined;
}

function mapServiceType(query) {
  if (query.type) {
    return query.type;
  }
  if (((query.age) && (query.age === constants.age.under16))
    || ((query.symptoms) && (query.symptoms === constants.symptoms.yes))) {
    return constants.serviceTypes.professional;
  }
  return undefined;
}

function mapServiceChoice(query) {
  if (query.origin) {
    return query.origin;
  }

  if ((query.symptoms) && (query.symptoms === constants.symptoms.yes)) {
    return constants.serviceChoices.symptoms;
  }

  if (query.age) {
    if (query.age === constants.age.under16) {
      return constants.serviceChoices.under16;
    }
    if (query.age === constants.age['16to25']) {
      return constants.serviceChoices['16to25'];
    }
    if (query.age === constants.age.over25) {
      return constants.serviceChoices.over25;
    }
  }
  return undefined;
}

module.exports = {
  getLocationHeading,
  mapServiceChoice,
  mapServiceType,
};
