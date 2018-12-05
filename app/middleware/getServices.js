const VError = require('verror').VError;

const searchRequest = require('../lib/search/request');
const maxNumberOfResults = require('../../config/config').search.maxNumberOfResults;
const searchServicesHistogram = require('../lib/prometheus/histograms').searchGetServices;
const promQueryLabelName = require('../lib/constants').promQueryLabelName;
const log = require('../lib/logger');
const mapResults = require('../lib/mappers/mapResults');
const queryBuilder = require('../lib/search/queryBuilder');
const queryMapper = require('../lib/utils/queryMapper');

function handleError(error, next) {
  const errMsg = 'Error making request to Search API';
  const newError = new VError(error.stack, errMsg);

  log.error({ err: newError }, errMsg);
  next(newError);
}

function processResults(response, searchOrigin, logResults) {
  const results = JSON.parse(response);
  const resultsCount = results['@odata.count'];
  logResults(resultsCount);
  return [mapResults(results, searchOrigin), resultsCount];
}

async function getServices(req, res, next) {
  const location = res.locals.location;
  const searchOrigin = res.locals.postcodeLocationDetails;

  const queryType = queryMapper.getQueryType(res.locals.type, res.locals.origin);
  const query = queryBuilder(searchOrigin, queryType, maxNumberOfResults);

  const endTimer = searchServicesHistogram.startTimer();
  const timerLabel = {};
  timerLabel[promQueryLabelName] = queryType;

  const logResults = (resultCount) => {
    endTimer(timerLabel);
    log.info({
      location,
      query,
      resultCount,
      searchOrigin,
    }, 'getServices from Search API - query and params');
  };

  try {
    const response = await searchRequest(query);
    [res.locals.services, res.locals.resultsCount] = processResults(
      response, searchOrigin, logResults
    );
    next();
  } catch (error) {
    handleError(error, next);
  }
}

module.exports = getServices;
