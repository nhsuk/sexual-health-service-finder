const getBaseQuery = require('./utils/getBaseQuery');

function build(location, size) {
  const query = getBaseQuery(size);

  query.body.query.bool.filter = {
    geo_distance: {
      distance: '50mi',
      'location.coordinates': {
        lat: location.lat,
        lon: location.lon,
      },
    },
  };

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

  query.body.query.bool.must = { match_all: {} };

  return query;
}

module.exports = {
  build,
};
