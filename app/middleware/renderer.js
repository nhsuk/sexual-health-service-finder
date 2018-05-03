const log = require('../lib/logger');
const constants = require('../lib/constants');
const messages = require('../lib/messages');

function startPage(req, res) {
  res.locals.analyticsPageTitle = 'Start';
  res.render('start');
}

function symptoms(req, res) {
  res.locals.analyticsPageTitle = 'Symptoms';
  res.render('symptoms');
}

function recommend(req, res) {
  if (!(res.locals.analyticsPageTitle) && (res.locals.symptoms === constants.symptoms.yes)) {
    res.locals.analyticsPageTitle = 'RecommendSymptoms';
  }
  res.render('recommend');
}

function age(req, res) {
  res.locals.analyticsPageTitle = 'Age';
  res.render('age');
}

function choose(req, res) {
  res.render('choose');
}

function location(req, res) {
  if (res.locals.correctLocationParams) {
    if (res.locals.correctLocationParams === 'redirect') {
      return res.render('chlamydiaOnlineRedirect');
    }
    return res.render('location');
  }
  return res.render('start');
}

function chlamydiaOnlineRedirect(req, res) {
  return res.redirect('https://www.nhs.uk/Service-Search/Chlamydia-free-online-tests-for-u-25s/LocationSearch/344');
}

function results(req, res) {
  if ((!res.locals.correctResultsParams)) {
    return res.render('start');
  }
  return res.render('results');
}

function emptyPostcode(req, res) {
  res.locals.errorMessage = messages.emptyPostcodeMessage();
  location(req, res);
}

function invalidPostcode(req, res, loc) {
  log.debug({ location: loc }, 'Location failed validation');
  res.locals.errorMessage = messages.invalidPostcodeMessage(loc);
  location(req, res);
}

function outsideOfEngland(req, res) {
  log.debug({ location: res.locals.location }, 'Outside of England');
  res.locals.outsideOfEnglandPostcodeFlag = true;
  location(req, res);
}

module.exports = {
  age,
  chlamydiaOnlineRedirect,
  choose,
  emptyPostcode,
  invalidPostcode,
  location,
  outsideOfEngland,
  recommend,
  results,
  startPage,
  symptoms,
};
