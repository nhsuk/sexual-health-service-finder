const VError = require('verror').VError;
const log = require('../lib/logger');
// const gpDataMapper = require('../lib/utils/gpDataMapper');
// const resultsFormat = require('../lib/utils/resultsHeaderFormater');
const elasticsearchClient = require('../lib/elasticsearchClient');
// const esQueryBuilder = require('../lib/esQueryBuilder');
const esGeoQueryBuilder = require('../lib/esGeoQueryBuilder');
const esGetServiceHistogram = require('../lib/promHistograms').esGetServices;
// const esQueryLabelName = require('../lib/constants').promESQueryLabelName;

function handleError(error, next) {
  const errMsg = 'Error with ES';

  log.error({ err: new VError(error.stack, errMsg) }, errMsg);
  next(error);
}

function mapResults(results, res) {
  res.locals.services = results.hits.hits.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    const service = result._source;

    if (service) {
      if (result.sort) {
        service.distance = result.sort[0];
      }
    }

    return service;
  });
}

function getServices(req, res, next) {
  const location = res.locals.location;
  const resultsLimit = res.locals.RESULTS_LIMIT;
  const postcodeLocationDetails = res.locals.postcodeLocationDetails;
  const esQuery = esGeoQueryBuilder.build(postcodeLocationDetails.location, resultsLimit);
  log.info('query ', esQuery);

  const endTimer = esGetServiceHistogram.startTimer();
  const timerLabel = {};
  // timerLabel[esQueryLabelName] = esQuery.label;
  elasticsearchClient
    .search(esQuery)
    .then((results) => {
      endTimer(timerLabel);
      log.info({
        esQuery,
        location,
        postcodeLocationDetails,
        resultCount: results.hits.total,
      }, 'getServices');
      res.locals.resultsCount = results.hits.total;
      mapResults(results, res);
    })
    .then(next)
    .catch(error => handleError(error, next));
}

module.exports = getServices;
