const extractProperty = require('../utils/extractProperty');

function mapServiceDetails(service) {
  const data = service.GSD;

  if (!data) { return undefined; }

  const opts = {
    extractionTargetKey: 'ElementText',
    searchTargetKey: 'ElementTitle',
    searchTargetValue: 'Service details',
  };

  return extractProperty(opts, data);
}

module.exports = mapServiceDetails;
