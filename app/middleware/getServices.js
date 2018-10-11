const VError = require('verror').VError;

const rp = require('request-promise-native');
// const esClient = require('../lib/elasticsearch/client');
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
    const headers = {
      'Content-Type': 'application/json',
      'api-key': '163B9B17F1E81C792A77E84B76B4C3ED',
    };
    const body = JSON.stringify({
      count: true,
      filter: 'OrganisationTypeID eq \'GSD\' and ServicesProvided/any(x: search.in(x, \'Chlamydia screening under 25s,Sexual health information and support\', \',\')) or ServiceCodesProvided/any(scp: search.in(scp, \'SRV0267,SRV0531\'))',
      orderby: 'geo.distance(Geocode, geography\'Point(-1 50)\')',
      search: '*',
      select: '*',
      top: 10,
    });

    const url = 'https://nhsuksearchprodne.search.windows.net/indexes/organisationlookup/docs/search?api-version=2017-11-11';
    const options = {
      body,
      headers,
      method: 'POST',
      url,
    };
    console.log(options);
    const response = await rp(options);
    // console.log(response);
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
