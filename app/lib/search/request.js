const rp = require('request-promise-native');

const headers = require('./headers');
const search = require('../../../config/config').search;

async function request(query, path) {
  const response = await rp({
    body: JSON.stringify(query),
    headers,
    method: 'POST',
    url: `https://${search.host}/service-search/${path}?api-version=${search.version}`,
  });
  return JSON.parse(response);
}

module.exports = request;
