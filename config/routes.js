const router = require('express').Router();
const renderer = require('../app/middleware/renderer');
const selectionValidator = require('../app/middleware/selectionValidator');

router.get(
  '/',
  renderer.startPage
);

router.get(
  '/symptoms',
  renderer.symptoms
);

router.get(
  '/recommend',
  selectionValidator,
  renderer.recommend
);

module.exports = router;
