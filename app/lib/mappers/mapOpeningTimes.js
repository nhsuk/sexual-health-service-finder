const extractProperty = require('../utils/extractProperty');
const formatOpeningTimes = require('../utils/formatOpeningTimes');

function mapOpeningTimes(service) {
  const openingTimes = service.OpeningTimes;

  if (openingTimes) {
    return {
      formatted: formatOpeningTimes(openingTimes),
    };
  }

  const data = service.GSD;

  if (!data) { return undefined; }

  const opts = {
    extractionTargetKey: 'ElementText',
    searchTargetKey: 'ElementTitle',
    searchTargetValue: 'Opening times',
  };

  const description = extractProperty(opts, data);
  if (description) {
    return { description };
  }
  return undefined;
}

module.exports = mapOpeningTimes;
