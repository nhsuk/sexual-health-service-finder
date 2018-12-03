const asAPIKey = require('../../../config/config').azureSearch.key;

module.exports = {
  'Content-Type': 'application/json',
  'api-key': asAPIKey,
};
