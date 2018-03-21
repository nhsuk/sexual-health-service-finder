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
    query.body.query.bool.must_not = getFilter(searchType).mustNotClause;
    query.body.query.bool.must = getFilter(searchType).mustClause;
  }

  return query;
}

module.exports = {
  build,
};
