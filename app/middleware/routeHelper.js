const renderer = require('./renderer');

function renderSymptomsPage(req, res, errorMessage) {
  res.locals.errorMessage = errorMessage;
  renderer.symptoms(req, res);
}

function renderAgePage(req, res) {
  renderer.age(req, res);
}

module.exports = {
  renderSymptomsPage,
  renderAgePage,
};
