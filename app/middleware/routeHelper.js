const renderer = require('./renderer');
const constants = require('../lib/constants');
const messages = require('../lib/messages');

function renderSymptomsWithError(req, res) {
  res.locals.errorMessage = messages.mandatorySelectionMessage();
  renderer.symptoms(req, res);
}

function renderAgePage(req, res) {
  renderer.age(req, res);
}

function renderAgePageWithError(req, res) {
  res.locals.errorMessage = messages.mandatorySelectionMessage();
  renderer.age(req, res);
}

function renderSeeExpertUnder16Page(req, res) {
  res.locals.under16 = true;
  res.locals.analyticsPageTitle = 'RecommendU16';
  renderer.recommend(req, res);
}

function renderChooseTestUnder25Page(req, res) {
  res.locals.under25 = true;
  res.locals.analyticsPageTitle = 'Options16-24';
  renderer.choose(req, res);
}

function renderChooseTestOver25Page(req, res) {
  res.locals.under25 = false;
  res.locals.under16 = false;
  res.locals.analyticsPageTitle = 'Options25+';
  renderer.choose(req, res);
}

function renderChoosePageWithError(req, res) {
  res.locals.errorMessage = messages.mandatorySelectionMessage();
  if (res.locals.origin === constants.serviceChoices['16to24']) {
    res.locals.under25 = true;
  } else {
    res.locals.under25 = false;
    res.locals.under16 = false;
  }
  renderer.choose(req, res);
}

function renderLocationPage(req, res) {
  renderer.location(req, res);
}

function renderOnlinePage(req, res) {
  renderer.chlamydiaOnlineRedirect(req, res);
}

function renderStartPageWithError(req, res) {
  res.locals.errorMessage = messages.invalidUrlMessage();
  renderer.startPage(req, res);
}

module.exports = {
  renderAgePage,
  renderAgePageWithError,
  renderChoosePageWithError,
  renderChooseTestOver25Page,
  renderChooseTestUnder25Page,
  renderLocationPage,
  renderOnlinePage,
  renderSeeExpertUnder16Page,
  renderStartPageWithError,
  renderSymptomsWithError,
};
