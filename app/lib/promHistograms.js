const promClient = require('./promBundle').promClient;
const buckets = require('./constants').promHistogramBuckets;
<<<<<<< HEAD
const esQueryLabelName = require('./constants').promESQueryLabelName;
=======
const esQueryLabelName = require('./constants').promEsQueryLabelName;
>>>>>>> 42efddf... :scissors: refactor, tidy views

module.exports = {
  esGetServices: new promClient.Histogram({
    buckets, help: 'Duration histogram of Elasticsearch request to get Services', labelNames: [esQueryLabelName], name: 'es_get_services',
  }),
  postcodesIORequest: new promClient.Histogram({ buckets, help: 'Duration histogram of postcodes.io request', name: 'postcodes_io_request_duration' }),
};
