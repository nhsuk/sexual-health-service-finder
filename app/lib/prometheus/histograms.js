const promClient = require('./bundle').promClient;
const buckets = require('../constants').promHistogramBuckets;
const promQueryLabelName = require('../constants').promQueryLabelName;

module.exports = {
  postcodeSearch: new promClient.Histogram({ buckets, help: 'Duration histogram of postcode search', name: 'postcode_search_duration' }),
  searchGetServices: new promClient.Histogram({
    buckets, help: 'Duration histogram of Search request to get Services', labelNames: [promQueryLabelName], name: 'search_get_services',
  }),
};
