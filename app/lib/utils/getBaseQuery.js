const esConfig = require('../../../config/config').es;

function getBaseQuery(size) {
  return {
    body: {
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
