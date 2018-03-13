const router = require('express').Router();
const renderer = require('../app/middleware/renderer');
const selectionValidatorSymptoms = require('../app/middleware/selectionValidatorSymptoms');
const selectionValidatorAge = require('../app/middleware/selectionValidatorAge');
const setLocals = require('../app/middleware/setLocals');
const locationValidator = require('../app/middleware/locationValidator');
const postcodeLookup = require('../app/middleware/postcodeLookup');
const notInEnglandHandler = require('../app/middleware/notInEnglandHandler');

router.get(
  '/',
  renderer.startPage
);

router.get(
  '/symptoms',
  setLocals.fromRequest,
  renderer.symptoms
);

router.get(
  '/recommend',
  setLocals.fromRequest,
  selectionValidatorSymptoms,
  renderer.recommend
);

router.get(
  '/age',
  setLocals.fromRequest,
  renderer.age
);

router.get(
  '/choose',
  setLocals.fromRequest,
  selectionValidatorAge,
  renderer.choose
);

router.get(
  '/location',
  setLocals.fromRequest,
  renderer.location
);

router.get(
  '/results',
  setLocals.fromRequest,
  locationValidator,
  postcodeLookup,
  notInEnglandHandler,
  renderer.results
);

module.exports = router;
