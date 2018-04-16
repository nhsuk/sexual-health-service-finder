const elasticsearch = require('elasticsearch');
const esConfig = require('../../../config/config').es;

const client = elasticsearch.Client({ host: `${esConfig.host}:${esConfig.port}` });

function getHealth() {
  return client.cat.health({ format: 'json' });
}

module.exports = {
  client,
  getHealth,
};
