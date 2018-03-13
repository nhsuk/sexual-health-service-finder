const router = require('express').Router();
const renderer = require('../app/middleware/renderer');
const selectionValidatorSymptoms = require('../app/middleware/selectionValidatorSymptoms');
const selectionValidatorAge = require('../app/middleware/selectionValidatorAge');

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
  selectionValidatorSymptoms,
  renderer.recommend
);

router.get(
  '/age',
  renderer.age
);

router.get(
  '/choose',
  selectionValidatorAge,
  renderer.choose
);

module.exports = router;
