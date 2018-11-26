const mapAddress = require('./mapAddress');
const mapContacts = require('./mapContacts');
const mapServiceDetails = require('./mapServiceDetails');
// const formatOpeningTimes = require('./formatOpeningTimes');

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
      // TODO: The opening times info comes from `OpeningTimes` if a pharmacy
      // else it comes from the `GSD` JSON and needs to be extracted. This
      // detail should be contained within the function
      service.openingTimes = mapServiceDetails(result);
      // service.openingTimes = formatOpeningTimes(result);
    }
    return service;
  }) : [];
}

module.exports = mapResults;
