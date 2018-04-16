const getBaseQuery = require('./utils/getBaseQuery');
const getFilter = require('./utils/getFilteredOutTermsQuery');

function build(location, searchType, size) {
  const query = getBaseQuery(location, size);
  query.body.query.bool = getFilter(searchType) || {};
  return query;
}

module.exports = {
  build,
};
