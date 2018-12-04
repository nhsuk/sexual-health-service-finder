const PostcodesIOClient = require('postcodesio-client');

const errorCounter = require('../lib/prometheus/counters').errorPageViews;
const log = require('../lib/logger');
const postcodesIORequestHistogram = require('../lib/prometheus/histograms').postcodesIORequest;
const validationCounter = require('../lib/prometheus/counters').validationLocationErrors;

const PostcodesIO = new PostcodesIOClient();
const renderer = require('./renderer');

function toArray(countries) {
  return Array.isArray(countries) ? countries : [countries];
}

function isOutcode(postcodeDetails) {
  return !postcodeDetails.incode;
}

function postcodeDetailsMapper(postcodeDetails) {
  return {
    countries: toArray(postcodeDetails.country),
    isOutcode: isOutcode(postcodeDetails),
    location: {
      lat: postcodeDetails.latitude,
      lon: postcodeDetails.longitude,
    },
  };
}

async function lookupPostcode(req, res, next) {
  const location = res.locals.location;

  log.debug({ location }, 'Postcode search text');
  const endTimer = postcodesIORequestHistogram.startTimer();
  if (location) {
    try {
      const postcodeDetails = await PostcodesIO.lookup(location);
      log.debug({ postcodeIOResponse: { postcodeDetails } }, 'PostcodeIO postcode response');
      if (postcodeDetails) {
        res.locals.postcodeLocationDetails = postcodeDetailsMapper(postcodeDetails);
        next();
      } else {
        validationCounter.inc(1);
        renderer.invalidPostcode(req, res, location);
      }
    } catch (error) {
      log.debug({ location }, 'Error in postcode lookup');
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

module.exports = lookupPostcode;
