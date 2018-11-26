const mapAddress = require('./mapAddress');
const mapContacts = require('./mapContacts');
const mapServiceDetails = require('./mapServiceDetails');
const mapOpeningTimes = require('./mapOpeningTimes');

function mapResults(results) {
  return results && results.value ? results.value.map((result) => {
    const service = {};
    if (result) {
      // TODO: Calculate the distance of the result from the search point
      // and add to service.distance
      service.address = mapAddress(result);
      service.contacts = mapContacts(result);
      service.name = result.OrganisationName;
      service.serviceDetails = mapServiceDetails(result);
      service.openingTimes = mapOpeningTimes(result);
    }
    return service;
  }) : [];
}

module.exports = mapResults;
