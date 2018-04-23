const VError = require('verror').VError;

const esClient = require('../lib/elasticsearch/client');
const esGetServiceHistogram = require('../lib/prometheus/histograms').esGetServices;
const esQueryLabelName = require('../lib/constants').promEsQueryLabelName;
const log = require('../lib/logger');
const mapResults = require('../lib/utils/mapResults');
const queryBuilder = require('../lib/elasticsearch/queryBuilder');
const queryMapper = require('../lib/utils/queryMapper');

function handleError(error, next) {
  const errMsg = 'Error with ES';
  const newError = new VError(error.stack, errMsg);

  log.error({ err: newError }, errMsg);
  next(newError);
}

function getEsQuery(postcodeLocationDetails, searchType, size) {
  return {
    label: searchType,
    query: queryBuilder.build(postcodeLocationDetails.location, searchType, size),
  };
}

function processResults(hits, logResults) {
  const resultsCount = hits.total;
  logResults(resultsCount);
  return [mapResults(hits), resultsCount];
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
    const esResults = await esClient.client.search(esQuery.query);
    [res.locals.services, res.locals.resultsCount] = processResults(esResults.hits, logResults);
    next();
  } catch (error) {
    handleError(error, next);
  }
}

module.exports = getServices;
