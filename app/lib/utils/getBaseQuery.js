const esConfig = require('../../../config/config').es;

function getBaseQuery(size) {
  return {
    body: {
      collapse: {
        field: 'uid',
      },
      query: {
        bool: {},
      },
      size,
    },
    index: esConfig.index,
    type: esConfig.type,
  };
}

module.exports = getBaseQuery;
