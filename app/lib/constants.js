/* eslint-disable sort-keys */
module.exports = {
  assetsUrl: 'https://assets.nhs.uk',
  siteRoot: '/find-a-chlamydia-test',
  promHistogramBuckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 5, 10],
  promEsQueryLabelName: 'query_type',
  searchTypes: {
    sexperts: 'sexual_health_professionals_geo',
  },
  symptoms: {
    yes: 'yes',
    no: 'no',
  },
  age: {
    under16: '1',
    '16to25': '2',
    over25: '3',
  },
  serviceChoices: {
    symptoms: '0',
    under16: '1',
    '16to25': '2',
    over25: '3',
  },
  serviceTypes: {
    professional: 'professional',
    kit: 'kit',
    online: 'online',
  },
};
/* eslint-enable sort-keys */
