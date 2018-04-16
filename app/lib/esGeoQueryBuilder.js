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
  query.body.query.bool = getFilter(searchType) || {};
  return query;
}

module.exports = {
  build,
};
