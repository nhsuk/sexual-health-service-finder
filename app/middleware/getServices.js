const VError = require('verror').VError;

const azureRequest = require('../lib/azuresearch/request');
const azureSearchGetServiceHistogram = require('../lib/prometheus/histograms').azureSearchGetServices;
const promQueryLabelName = require('../lib/constants').promQueryLabelName;
const log = require('../lib/logger');
const mapResults = require('../lib/mappers/mapResults');
const queryBuilder = require('../lib/azuresearch/queryBuilder');
const queryMapper = require('../lib/utils/queryMapper');

function handleError(error, next) {
  const errMsg = 'Error making request to Azure Search';
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
  const resultsLimit = res.locals.RESULTS_LIMIT;
  const searchOrigin = res.locals.postcodeLocationDetails;

  const queryType = queryMapper.getQueryType(res.locals.type, res.locals.origin);
  const query = queryBuilder(searchOrigin, queryType, resultsLimit);

  const endTimer = azureSearchGetServiceHistogram.startTimer();
  const timerLabel = {};
  timerLabel[promQueryLabelName] = queryType;

  const logResults = (resultCount) => {
    endTimer(timerLabel);
    log.info({
      location,
      query,
      resultCount,
      searchOrigin,
    }, 'getServices Azure Search query and params');
  };

  try {
    const response = await azureRequest(query);
    [res.locals.services, res.locals.resultsCount] = processResults(
      response, searchOrigin, logResults
    );
    next();
  } catch (error) {
    handleError(error, next);
  }
}

module.exports = getServices;
