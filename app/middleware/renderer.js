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

function choose(req, res) {
  res.render('choose');
}

module.exports = {
  startPage,
  symptoms,
  recommend,
  age,
  choose,
};
