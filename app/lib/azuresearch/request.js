const rp = require('request-promise-native');

const asConfig = require('../../../config/config').azureSearch;
const headers = require('./headers');

async function request(query) {
  const url = `https://${asConfig.serviceName}.search.windows.net/indexes/${asConfig.index}/docs/search?api-version=${asConfig.version}`;

  const options = {
    body: JSON.stringify(query),
    headers,
    method: 'POST',
    url,
  };

  return rp(options);
}

module.exports = request;
