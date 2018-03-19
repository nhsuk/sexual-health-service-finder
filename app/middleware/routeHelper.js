const renderer = require('./renderer');
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
  renderer.recommend(req, res);
}

function renderChooseTestUnder25Page(req, res) {
  res.locals.under25 = true;
  renderer.choose(req, res);
}

module.exports = {
  renderAgePage,
  renderAgePageWithError,
  renderChooseTestUnder25Page,
  renderSeeExpertUnder16Page,
  renderSymptomsWithError,
};
