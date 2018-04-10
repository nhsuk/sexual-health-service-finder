const VError = require('verror').VError;
const elasticsearchClient = require('../lib/elasticsearchClient');
const esGeoQueryBuilder = require('../lib/esGeoQueryBuilder');
const esGetServiceHistogram = require('../lib/promHistograms').esGetServices;
const esQueryLabelName = require('../lib/constants').promEsQueryLabelName;
const queryMapper = require('../lib/utils/queryMapper');
const serviceDataMapper = require('../lib/utils/serviceDataMapper');
const log = require('../lib/logger');

function handleError(error, next) {
  const errMsg = 'Error with ES';
  const newError = new VError(error.stack, errMsg);

  log.error({ err: newError }, errMsg);
  next(newError);
}

function mapResults(results, res) {
  res.locals.services = results.hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const service = result._source;

    if (service) {
      if (result.sort) {
        service.distance = result.sort[0];
      }
      service.address.fullAddress = serviceDataMapper.addressFormatter(service.address);
    }

    return service;
  });
}

function getEsQuery(postcodeLocationDetails, searchType, size) {
  return {
    label: searchType,
    query: esGeoQueryBuilder.build(postcodeLocationDetails.location, searchType, size),
  };
}

function getServices(req, res, next) {
  const location = res.locals.location;
  const resultsLimit = res.locals.RESULTS_LIMIT;
  const postcodeLocationDetails = res.locals.postcodeLocationDetails;
  const searchType = queryMapper.getEsQueryType(res.locals.type, res.locals.origin);
  const esQuery = getEsQuery(
    postcodeLocationDetails,
    searchType,
    resultsLimit
  );

  const endTimer = esGetServiceHistogram.startTimer();
  const timerLabel = {};
  timerLabel[esQueryLabelName] = esQuery.label;
  elasticsearchClient
    .client
    .search(esQuery.query)
    .then((results) => {
      endTimer(timerLabel);
      log.info({
        esQuery,
        location,
        postcodeLocationDetails,
        resultCount: results.hits.total,
      }, 'getServices ES query and params');
      res.locals.resultsCount = results.hits.total;
      mapResults(results, res);
    })
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getServices;
