function startPage(req, res) {
  res.render('start-page');
}

function symptoms(req, res) {
  res.render('symptoms');
}

function recommend(req, res) {
  res.render('recommend');
}

module.exports = {
  startPage,
  symptoms,
  recommend,
};
