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

function processResults(response, logResults) {
  const results = JSON.parse(response);
  const resultsCount = results['@odata.count'];
  logResults(resultsCount);
  return [mapResults(results), resultsCount];
}

async function getServices(req, res, next) {
  const location = res.locals.location;
  const resultsLimit = res.locals.RESULTS_LIMIT;
  const postcodeLocationDetails = res.locals.postcodeLocationDetails;

  const searchType = queryMapper.getEsQueryType(res.locals.type, res.locals.origin);
  const query = queryBuilder.build(postcodeLocationDetails.location, searchType, resultsLimit);

  const endTimer = azureSearchGetServiceHistogram.startTimer();
  const timerLabel = {};
  timerLabel[promQueryLabelName] = searchType;

  const logResults = (resultCount) => {
    endTimer(timerLabel);
    log.info({
      location,
      postcodeLocationDetails,
      query,
      resultCount,
    }, 'getServices Azure Search query and params');
  };

  try {
    // TODO: Pass the query into azureRequest
    const response = await azureRequest(query);
    [res.locals.services, res.locals.resultsCount] = processResults(response, logResults);
    next();
  } catch (error) {
    handleError(error, next);
  }
}

module.exports = getServices;
