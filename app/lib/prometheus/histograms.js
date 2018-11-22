const promClient = require('./bundle').promClient;
const buckets = require('../constants').promHistogramBuckets;
const promQueryLabelName = require('../constants').promQueryLabelName;

module.exports = {
  azureSearchGetServices: new promClient.Histogram({
    buckets, help: 'Duration histogram of Azure Search request to get Services', labelNames: [promQueryLabelName], name: 'azuresearch_get_services',
  }),
  postcodesIORequest: new promClient.Histogram({ buckets, help: 'Duration histogram of postcodes.io request', name: 'postcodes_io_request_duration' }),
};
