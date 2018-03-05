const router = require('express').Router();
const renderer = require('../app/middleware/renderer');

router.get(
  '/',
  renderer.startPage
);

router.get(
  '/symptoms',
  renderer.symptoms
);

module.exports = router;
