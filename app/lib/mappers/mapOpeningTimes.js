const extractProperty = require('../utils/extractProperty');
const formatOpeningTimes = require('../formatters/formatOpeningTimes');

function getOpeningTimesDescription(service) {
  const data = service.GSD;

  if (!data) { return undefined; }

  const opts = {
    extractionTargetKey: 'ElementText',
    searchTargetKey: 'ElementTitle',
    searchTargetValue: 'Opening times',
  };

  const description = extractProperty(opts, data);

  return description
    ? { description }
    : undefined;
}

function getStructuredOpeningTimes(openingTimes) {
  return { formatted: formatOpeningTimes(openingTimes) };
}

function mapOpeningTimes(service) {
  const openingTimes = service.OpeningTimes;

  return openingTimes
    ? getStructuredOpeningTimes(openingTimes)
    : getOpeningTimesDescription(service);
}

module.exports = mapOpeningTimes;
