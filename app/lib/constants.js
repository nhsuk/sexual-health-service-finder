module.exports = {
  age: {
    '16to24': '2',
    over25: '3',
    under16: '1',
  },
  assetsUrl: 'https://assets.nhs.uk',
  promHistogramBuckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 5, 10],
  promQueryLabelName: 'query_type',
  queryTypes: {
    kits16to24: 'kits16to24',
    kitsOver25: 'kitsOver25',
    sexperts: 'sexperts',
  },
  serviceChoices: {
    '16to24': '2',
    over25: '3',
    symptoms: '0',
    under16: '1',
  },
  serviceTypes: {
    kit: 'kit',
    online: 'online',
    professional: 'professional',
  },
  siteRoot: '/find-a-chlamydia-test',
  symptoms: {
    no: 'no',
    yes: 'yes',
  },
};
