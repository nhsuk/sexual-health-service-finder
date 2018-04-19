const Entities = require('html-entities').AllHtmlEntities;

const formatAddress = require('./formatAddress');
const formatOpeningTimes = require('./formatOpeningTimes');

const entities = new Entities();
const htmlQuoteRegex = /&quot;/g;

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
        const description = openingTimes.description;
        if (description) { openingTimes.description = entities.decode(description.replace(htmlQuoteRegex, '')); }
      }
      const serviceDetails = service.serviceDetails;
      if (serviceDetails) { service.serviceDetails = entities.decode(serviceDetails.replace(htmlQuoteRegex, '')); }
    }
    return service;
  }) : [];
}

module.exports = mapResults;
