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
  res.render('choose');
}

function location(req, res) {
  if (res.locals.locationHeading === null) {
    return res.render('error');
  }
  return res.render('location');
}

function results(req, res) {
  res.render('results');
}

function emptyPostcodePage(req, res) {
  log.debug('Empty Search');
  res.locals.errorMessage = messages.emptyPostcodeMessage();
  location(req, res);
}

function postcodeError(error, postcode, res, next) {
  log.debug({ postcode }, 'Error in postcode');
  res.locals.errorMessage = messages.technicalProblems();
  next(error);
}

function invalidPostcodePage(postcode, req, res) {
  log.debug({ postcode }, 'Location failed validation');
  res.locals.errorMessage = messages.invalidPostcodeMessage(postcode);
  location(req, res);
}

function outsideOfEnglandPage(loc, req, res) {
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
  emptyPostcodePage,
  postcodeError,
  invalidPostcodePage,
  outsideOfEnglandPage,
  results,
};
