const router = require('express').Router();
const locationValidator = require('../app/middleware/locationValidator');
const notInEnglandHandler = require('../app/middleware/notInEnglandHandler');
const postcodeLookup = require('../app/middleware/postcodeLookup');
const renderer = require('../app/middleware/renderer');
const selectionValidatorSymptoms = require('../app/middleware/selectionValidatorSymptoms');
const selectionValidatorAge = require('../app/middleware/selectionValidatorAge');
const selectionValidatorChoose = require('../app/middleware/selectionValidatorChoose');

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
  selectionValidatorChoose,
  renderer.location
);

router.get(
  '/chlamydia-online-redirect',
  renderer.chlamydiaOnlineRedirect
);

router.get(
  '/results',
  locationValidator,
  postcodeLookup,
  notInEnglandHandler,
  renderer.results
);

module.exports = router;
