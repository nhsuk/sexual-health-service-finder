const VError = require('verror').VError;

const esClient = require('../lib/elasticsearch/client');
const esGetServiceHistogram = require('../lib/prometheus/histograms').esGetServices;
const esQueryLabelName = require('../lib/constants').promEsQueryLabelName;
const formatAddress = require('../lib/utils/formatAddress');
const formatOpeningTimes = require('../lib/utils/formatOpeningTimes');
const log = require('../lib/logger');
const queryBuilder = require('../lib/elasticsearch/queryBuilder');
const queryMapper = require('../lib/utils/queryMapper');

function handleError(error, next) {
  const errMsg = 'Error with ES';
  const newError = new VError(error.stack, errMsg);

  log.error({ err: newError }, errMsg);
  next(newError);
}

function mapResults(results) {
  const services = results.hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const service = result._source;

    if (service) {
      if (result.sort) {
        service.distance = result.sort[0];
      }
      service.address.fullAddress = formatAddress(service.address);
      if (service.openingTimes) {
        service.openingTimes.formatted = formatOpeningTimes(service.openingTimes);
      }
    }
    return service;
  });
  return services;
}

function getEsQuery(postcodeLocationDetails, searchType, size) {
  return {
    label: searchType,
    query: queryBuilder.build(postcodeLocationDetails.location, searchType, size),
  };
}

function processResults(results, logResults) {
  const resultsCount = results.hits.total;
  logResults(resultsCount);
  return [mapResults(results), resultsCount];
}

async function getServices(req, res, next) {
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
  const logResults = (resultCount) => {
    endTimer(timerLabel);
    log.info({
      esQuery,
      location,
      postcodeLocationDetails,
      resultCount,
    }, 'getServices ES query and params');
  };

  try {
    const results = await esClient.client.search(esQuery.query);
    [res.locals.services, res.locals.resultsCount] = processResults(results, logResults);
    next();
  } catch (error) {
    handleError(error, next);
  }
}

module.exports = getServices;
