const nock = require('nock');

const headers = require('../../app/lib/search/headers');
const postcodeSearchQueryBuilder = require('../../app/lib/search/postcodeSearchQueryBuilder');
const search = require('../../config/config').search;

const searchHost = `https://${search.host}`;

function createNock(path, body, statusCode, responsePath) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const response = require(`../resources/${responsePath}`);
  return nock(searchHost, { encodedQueryParams: true, reqheaders: headers })
    .post(`/service-search${path}`, body)
    .query({ 'api-version': search.version })
    .reply(statusCode, response);
}

function postcodeSearch(location, statusCode, responsePath) {
  const body = postcodeSearchQueryBuilder(location);
  createNock('/postcodesandplaces/search', body, statusCode, responsePath);
}

function serviceSearch(body, statusCode, responsePath) {
  createNock('/search', body, statusCode, responsePath);
}

module.exports = {
  postcodeSearch,
  serviceSearch,
};
