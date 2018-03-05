function startPage(req, res) {
  res.render('start-page');
}

function symptoms(req, res) {
  res.render('symptoms');
}

module.exports = {
  startPage,
  symptoms,
};
