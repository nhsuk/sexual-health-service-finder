const VError = require('verror').VError;

const azureRequest = require('../lib/azuresearch/request');
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
    const query = {
      count: true,
      filter: 'OrganisationTypeID eq \'GSD\' and ServicesProvided/any(x: search.in(x, \'Chlamydia screening under 25s,Sexual health information and support\', \',\')) or ServiceCodesProvided/any(scp: search.in(scp, \'SRV0267,SRV0531\'))',
      orderby: 'geo.distance(Geocode, geography\'Point(-1 50)\')',
      search: '*',
      select: '*',
      top: 10,
    };

    // TODO: Pass the query into azureRequest
    const response = await azureRequest(query);
    [res.locals.services, res.locals.resultsCount] = processResults(response, logResults);
    console.log('************************');
    console.log(res.locals.resultsCount);
    // console.log(res.locals.services);
    next();
  } catch (error) {
    handleError(error, next);
  }
}

module.exports = getServices;
