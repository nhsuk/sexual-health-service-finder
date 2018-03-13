const log = require('../lib/logger');
const messages = require('../lib/messages');

function startPage(req, res) {
  res.render('start');
}

function symptoms(req, res) {
  res.render('symptoms');
}

function recommend(req, res) {
  res.render('recommend');
}

function age(req, res) {
  res.render('age');
}

function choose(req, res) {
  return res.render('choose');
}

function location(req, res) {
  if (!res.locals.correctLocationParams) {
    return res.render('error');
  }
  return res.render('location');
}

function results(req, res) {
  res.render('results');
}

function emptyPostcode(req, res) {
  log.debug('Empty search');
  res.locals.errorMessage = messages.emptyPostcodeMessage();
  location(req, res);
}

function invalidPostcode(req, res, loc) {
  log.debug({ loc }, 'Location failed validation');
  res.locals.errorMessage = messages.invalidPostcodeMessage(loc);
  location(req, res);
}

function outsideOfEngland(req, res, loc) {
  log.debug({ loc }, 'Outside of England');
  res.locals.errorMessage = messages.outsideOfEnglandPostcodeMessage();
  location(req, res);
}

module.exports = {
  startPage,
  symptoms,
  recommend,
  age,
  choose,
  location,
  emptyPostcode,
  invalidPostcode,
  outsideOfEngland,
  results,
};
