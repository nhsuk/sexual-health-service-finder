const getBaseQuery = require('./utils/getBaseQuery');
const getFilter = require('./utils/getFilteredOutTermsQuery');

function build(location, searchType, size) {
  const query = getBaseQuery(size);

  query.body.sort = [
    {
      _geo_distance: {
        distance_type: 'plane',
        'location.coordinates': {
          lat: location.lat,
          lon: location.lon,
        },
        order: 'asc',
        unit: 'mi',
      },
    },
  ];

  if (getFilter(searchType)) {
    if (getFilter(searchType).mustClause) {
      query.body.query.bool.must = getFilter(searchType).mustClause;
    }
    if (getFilter(searchType).shouldClause) {
      query.body.query.bool.minimum_should_match = getFilter(searchType).minShouldMatch;
      query.body.query.bool.should = getFilter(searchType).shouldClause;
    }
    query.body.query.bool.must_not = getFilter(searchType).mustNotClause;
  }

  return query;
}

module.exports = {
  build,
};
