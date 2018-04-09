const constants = require('../constants');

function getValues(myHash) {
  const keys = Object.keys(myHash);

  return keys.map(v => myHash[v]);
}

function getAlternativeTypeFor(type) {
  if (type === constants.serviceTypes.professional) {
    return constants.serviceTypes.kit;
  } else if (type === constants.serviceTypes.kit) {
    return constants.serviceTypes.professional;
  }
  return type;
}

function areEqual(queryItem, item) {
  return (queryItem.localeCompare(item, 'en', { sensitivity: 'base' }) === 0);
}

function isProfessionalChoice(query) {
  return (areEqual(query.type, constants.serviceTypes.professional)
    && (getValues(constants.serviceChoices).includes(query.origin)));
}

function getResultsInternalUrl(query, location) {
  return `${constants.siteRoot}/results?location=${location}&type=${getAlternativeTypeFor(query.type)}&origin=${query.origin}`;
}

function checkRightReferer(headers, referer) {
  // TODO: enable before go-live
  return (headers.referer === referer); // This doesn't work all the time
}

module.exports = {
  areEqual,
  checkRightReferer,
  getResultsInternalUrl,
  isProfessionalChoice,
};
