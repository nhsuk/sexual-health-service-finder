const renderer = require('./renderer');

function renderSymptomsPage(req, res, errorMessage) {
  res.locals.errorMessage = errorMessage;
  renderer.symptoms(req, res);
}

module.exports = {
  renderSymptomsPage,
};
