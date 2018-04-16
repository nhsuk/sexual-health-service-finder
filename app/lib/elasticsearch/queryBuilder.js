const baseQuery = require('./baseQuery');
const coreQuery = require('./coreQuery');

function build(location, searchType, size) {
  const query = baseQuery(location, size);
  query.body.query.bool = coreQuery(searchType) || {};
  return query;
}

module.exports = {
  build,
};
