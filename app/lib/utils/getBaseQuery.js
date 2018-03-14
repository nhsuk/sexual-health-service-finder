function getBaseQuery(size) {
  return {
    body: {
      query: {
        bool: {},
      },
      size,
    },
    index: 'sexual-health-services',
    type: 'sexual-health-service',
  };
}

module.exports = getBaseQuery;
