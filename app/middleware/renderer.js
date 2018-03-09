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

module.exports = {
  startPage,
  symptoms,
  recommend,
  age,
};
