const esConfig = require('../../../config/config').es;

function baseQuery(location, size) {
  return {
    body: {
      collapse: {
        field: 'uid',
      },
      query: {
      },
      size,
      sort: [
        {
          _geo_distance: {
            distance_type: 'arc',
            'location.coordinates': {
              lat: location.lat,
              lon: location.lon,
            },
            order: 'asc',
            unit: 'mi',
          },
        },
      ],
    },
    index: esConfig.index,
    type: esConfig.type,
  };
}

module.exports = baseQuery;
