const router = require('express').Router();
const renderer = require('../app/middleware/renderer');

router.get(
  '/',
  renderer.findHelp
);

module.exports = router;
