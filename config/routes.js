const router = require('express').Router();

const getServices = require('../app/middleware/getServices');
const locationValidator = require('../app/middleware/locationValidator');
const postcodeSearch = require('../app/middleware/postcodeSearch');
const prerender = require('../app/middleware/prerender');
const renderer = require('../app/middleware/renderer');
const selectionValidatorAge = require('../app/middleware/selectionValidatorAge');
const selectionValidatorChoose = require('../app/middleware/selectionValidatorChoose');
const selectionValidatorSymptoms = require('../app/middleware/selectionValidatorSymptoms');

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
  postcodeSearch,
  getServices,
  prerender.results,
  renderer.results
);

module.exports = router;
