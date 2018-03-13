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

function renderSeeExpertPage(req, res) {
  renderer.recommend(req, res);
}

module.exports = {
  renderSymptomsWithError,
  renderAgePage,
  renderAgePageWithError,
  renderSeeExpertPage,
};
