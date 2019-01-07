const errorCounter = require('../lib/prometheus/counters').errorPageViews;
const log = require('../lib/logger');
const postcodeNotFoundWarnings = require('../lib/prometheus/counters').postcodeNotFoundWarnings;
const postcodeSearchHistogram = require('../lib/prometheus/histograms').postcodeSearch;
const queryBuilder = require('../lib/search/postcodeSearchQueryBuilder');
const renderer = require('./renderer');
const searchRequest = require('../lib/search/request');

function isOutcode(postcodeDetails) {
  return postcodeDetails.Type === 'PostcodeOutCode';
}

function postcodeDetailsMapper(postcodeDetails) {
  return {
    isOutcode: isOutcode(postcodeDetails),
    location: {
      lat: postcodeDetails.Latitude,
      lon: postcodeDetails.Longitude,
    },
  };
}

async function performPostcodeSearch(location) {
  const query = queryBuilder(location);
  const path = 'postcodesandplaces/search';
  const response = await searchRequest(query, path);
  log.debug({ postcodeSearchResponse: { response } }, 'Postcode Search response');
  return response;
}

async function postcodeSearch(req, res, next) {
  const location = res.locals.location;

  log.debug({ location }, 'Postcode search text');
  const endTimer = postcodeSearchHistogram.startTimer();
  if (location) {
    try {
      const postcodeDetails = await performPostcodeSearch(location);

      if (postcodeDetails && postcodeDetails.value && postcodeDetails.value.length) {
        res.locals.postcodeLocationDetails = postcodeDetailsMapper(postcodeDetails.value[0]);
        next();
      } else {
        postcodeNotFoundWarnings.inc(1);
        renderer.postcodeNotFound(req, res);
      }
    } catch (error) {
      log.debug({ location }, 'Error in postcode Search');
      errorCounter.inc(1);
      next(error);
    } finally {
      endTimer();
    }
  } else {
    log.debug('No postcode');
    next();
  }
}

module.exports = postcodeSearch;
