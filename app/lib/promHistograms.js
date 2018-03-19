const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;
const esQueryLabelName = require('./constants').promESQueryLabelName;

module.exports = {
  esGetServices: new promClient.Histogram({
    buckets, help: 'Duration histogram of Elasticsearch request to get Services', labelNames: [esQueryLabelName], name: 'es_get_services',
  }),
  postcodesIORequest: new promClient.Histogram({ buckets, help: 'Duration histogram of postcodes.io request', name: 'postcodes_io_request_duration' }),
};
