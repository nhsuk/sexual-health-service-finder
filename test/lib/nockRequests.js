const nock = require('nock');

const asConfig = require('../../config/config').azureSearch;
const headers = require('../../app/lib/azuresearch/headers');

const host = `https://${asConfig.serviceName}.search.windows.net`;

function createNock(path, body) {
  return nock(host, { encodedQueryParams: true, reqheaders: headers })
    .post(path, body)
    .query({ 'api-version': asConfig.version });
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
