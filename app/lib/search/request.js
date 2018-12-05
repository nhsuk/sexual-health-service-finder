const rp = require('request-promise-native');

const search = require('../../../config/config').search;
const headers = require('./headers');

async function request(query) {
  return rp({
    body: JSON.stringify(query),
    headers,
    method: 'POST',
    url: `https://${search.host}/service-search/search?api-version=${search.version}`,
  });
}

module.exports = request;
