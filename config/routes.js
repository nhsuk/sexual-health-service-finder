const router = require('express').Router();
const getServices = require('../app/middleware/getServices');
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
  getServices,
  renderer.results
);

module.exports = router;
