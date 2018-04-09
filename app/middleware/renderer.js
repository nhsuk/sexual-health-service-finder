const log = require('../lib/logger');
const messages = require('../lib/messages');
// const utils = require('../lib/utils/utils');

function startPage(req, res) {
  res.render('start');
}

function symptoms(req, res) {
  // if ((!utils.checkRightReferer(req.headers, `${constants.siteRoot}/start`))
  //   && ((!utils.checkRightReferer(req.headers, `${constants.siteRoot}/`)))) {
  //   res.locals.errorMessage = messages.invalidUrlMessage();
  //   return res.render('start');
  // }
  return res.render('symptoms');
}

function recommend(req, res) {
  // if (!utils.checkRightReferer(req.headers, `${constants.siteRoot}/symptoms`)) {
  //   res.locals.errorMessage = messages.invalidUrlMessage();
  //   return res.render('start');
  // }
  return res.render('recommend');
}

function age(req, res) {
  // if (!utils.checkRightReferer(req.headers, `${constants.siteRoot}/symptoms`)) {
  //   res.locals.errorMessage = messages.invalidUrlMessage();
  //   return res.render('start');
  // }
  return res.render('age');
}

function choose(req, res) {
  // if (!utils.checkRightReferer(req.headers, `${constants.siteRoot}/age`)) {
  //   res.locals.errorMessage = messages.invalidUrlMessage();
  //   return res.render('start');
  // }
  return res.render('choose');
}

function location(req, res) {
  if (res.locals.correctLocationParams) {
    if ((res.locals.correctLocationParams === 'redirect')) {
      // && (utils.checkRightReferer(req.headers, `${constants.siteRoot}/choose`))) {
      return res.render('chlamydiaOnlineRedirect');
    // } else {
    //   return res.render('start');
    }
  } else {
    // if ((!utils.checkRightReferer(req.headers, `${constants.siteRoot}/choose`))
    // && (!utils.checkRightReferer(req.headers, `${constants.siteRoot}/recommend`))) {
    res.locals.errorMessage = messages.invalidUrlMessage();
    return res.render('start');
  }
  return res.render('location');
}

function chlamydiaOnlineRedirect(req, res) {
  return res.redirect('https://www.nhs.uk/Service-Search/Chlamydia-free-online-tests-for-u-25s/LocationSearch/344');
}

function results(req, res) {
  if ((!res.locals.correctResultsParams)) {
    // || (!utils.checkRightReferer(req.headers, `${constants.siteRoot}/location`))) {
    res.locals.errorMessage = messages.invalidUrlMessage();
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
