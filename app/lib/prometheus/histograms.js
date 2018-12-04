const promClient = require('./bundle').promClient;
const buckets = require('../constants').promHistogramBuckets;
const promQueryLabelName = require('../constants').promQueryLabelName;

module.exports = {
  postcodesIORequest: new promClient.Histogram({ buckets, help: 'Duration histogram of postcodes.io request', name: 'postcodes_io_request_duration' }),
  searchGetServices: new promClient.Histogram({
    buckets, help: 'Duration histogram of Search request to get Services', labelNames: [promQueryLabelName], name: 'search_get_services',
  }),
};
