const nock = require('nock');

const search = require('../../config/config').search;
const headers = require('../../app/lib/search/headers');

const searchHost = `https://${search.host}`;

function createNock(path, body) {
  return nock(searchHost, { encodedQueryParams: true, reqheaders: headers })
    .post(path, body)
    .query({ 'api-version': search.version });
}

function postcodesIO(path, statusCode, responsePath) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const response = require(`../resources/${responsePath}`);
  const postcodesIOHost = 'https://api.postcodes.io';
  return nock(postcodesIOHost, { encodedQueryParams: true })
    .get(path)
    .reply(statusCode, response);
}

function withResponseBody(path, body, statusCode, responsePath) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const response = require(`../resources/${responsePath}`);
  createNock(path, body)
    .reply(statusCode, response);
}

module.exports = {
  postcodesIO,
  withResponseBody,
};
