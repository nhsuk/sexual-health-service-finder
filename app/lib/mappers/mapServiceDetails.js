const VError = require('verror').VError;

const log = require('../logger');

// TODO: This is common between contact methods and service details
function mapServiceDetail(service, serviceDetails, serviceDetailType) {
  const result = serviceDetails
    .find(serviceDetail => serviceDetail.ElementTitle === serviceDetailType);
  if (result) {
    return result.OrganisationContactValue;
  }
  return undefined;
}

function mapServiceDetails(service) {
  if (!service.GSD) { return undefined; }

  let serviceDetails;
  try {
    serviceDetails = JSON.parse(service.GSD);
    const serviceDetailTypes = ['Service details', 'Opening times', 'Venue Type'];
    serviceDetails = serviceDetailTypes
      .forEach(serviceDetailType => mapServiceDetail(service, serviceDetails, serviceDetailType));
  } catch (err) {
    const msg = `Error parsing JSON for 'GSD' for OrganisationID: ${service.OrganisationID}.`;
    const error = new VError(err.stack, msg);
    log.error({ err: error }, msg);
  }

  return serviceDetails;
}

module.exports = mapServiceDetails;
