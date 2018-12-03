const rp = require('request-promise-native');

const asConfig = require('../../../config/config').azureSearch;
const headers = require('./headers');

async function request(query) {
  return rp({
    body: JSON.stringify(query),
    headers,
    method: 'POST',
    url: `https://${asConfig.serviceName}.search.windows.net/indexes/${asConfig.index}/docs/search?api-version=${asConfig.version}`,
  });
}

module.exports = request;
