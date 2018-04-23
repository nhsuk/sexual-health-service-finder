const formatAddress = require('./formatAddress');
const formatOpeningTimes = require('./formatOpeningTimes');

function mapResults(hits) {
  return hits && hits.hits ? hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const service = result._source;
    if (service) {
      if (result.sort) { service.distance = result.sort[0]; }

      const address = service.address;
      if (address) { address.fullAddress = formatAddress(address); }

      const openingTimes = service.openingTimes;
      if (openingTimes) {
        openingTimes.formatted = formatOpeningTimes(openingTimes);
      }
    }
    return service;
  }) : [];
}

module.exports = mapResults;
