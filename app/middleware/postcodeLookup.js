const PostcodesIOClient = require('postcodesio-client');
const errorCounter = require('../lib/promCounters').errorPageViews;
const log = require('../lib/logger');
const validationCounter = require('../lib/promCounters').validationLocationErrors;

// rewire (a framework for mocking) doesn't support const
// eslint-disable-next-line no-var
var PostcodesIO = new PostcodesIOClient();
// eslint-disable-next-line no-var
var renderer = require('./renderer');

function toArray(countries) {
  return Array.isArray(countries) ? countries : [countries];
}

function isOutcode(postcodeDetails) {
  return !postcodeDetails.incode;
}

function postcodeDetailsMapper(postcodeDetails) {
  return {
    isOutcode: isOutcode(postcodeDetails),
    location: {
      lat: postcodeDetails.latitude,
      lon: postcodeDetails.longitude,
    },
    countries: toArray(postcodeDetails.country),
  };
}

async function lookupPostcode(req, res, next) {
  const location = res.locals.location;

  log.debug({ location }, 'Postcode search text');
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
    }
  } else {
    log.debug('No postcode');
    next();
  }
}

module.exports = lookupPostcode;
