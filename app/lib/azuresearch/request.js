const rp = require('request-promise-native');
const asConfig = require('../../../config/config').azureSearch;

async function request(query) {
  const headers = {
    'Content-Type': 'application/json',
    'api-key': asConfig.key,
  };

  const url = `https://${asConfig.serviceName}.search.windows.net/indexes/${asConfig.index}/docs/search?api-version=${asConfig.apiVersion}`;

  const options = {
    body: JSON.stringify(query),
    headers,
    method: 'POST',
    url,
  };

  return rp(options);
}

module.exports = {
  request,
};
