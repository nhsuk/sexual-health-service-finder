const mapAddress = require('./mapAddress');
const mapContacts = require('./mapContacts');
const mapDistanceMessage = require('./mapDistanceMessage');
const mapServiceDetails = require('./mapServiceDetails');
const mapOpeningTimes = require('./mapOpeningTimes');

function mapResults(results, searchOrigin) {
  return results && results.value ? results.value.map((result) => {
    const service = {};
    if (result) {
      service.distanceMessage = mapDistanceMessage(searchOrigin, result);
      service.address = mapAddress(result);
      service.contacts = mapContacts(result);
      service.name = result.OrganisationName;
      service.openingTimes = mapOpeningTimes(result);
      service.serviceDetails = mapServiceDetails(result);
    }
    return service;
  }) : [];
}

module.exports = mapResults;
