const constants = require('../constants');

const mustNotClause = [
  { match: { name: 'Marie Stopes' } },
  { match: { name: 'Young People Friendly Practice' } },
  { match: { name: 'BPAS' } },
];

const queryFilters = {};

queryFilters[constants.searchTypes.sexperts] = {
  must: [
    { match: { serviceType: 'Sexual health information and support' } },
    { match: { venueType: 'Clinic' } },
  ],
  must_not: mustNotClause,
};

queryFilters[constants.searchTypes.kitsOver25] = {
  must: [
    { match: { serviceType: 'SRV0531' } },
  ],
  must_not: mustNotClause,
};

queryFilters[constants.searchTypes.kits16to24] = {
  minimum_should_match: 1,
  must_not: mustNotClause,
  should: [
    {
      bool: {
        must: [
          { match: { serviceType: 'SRV0267' } },
        ],
      },
    },
    {
      bool: {
        must: [
          { match: { serviceType: 'Sexual health information and support' } },
          { match: { venueType: 'Community' } },
        ],
      },
    },
    {
      bool: {
        minimum_should_match: 1,
        must: { match: { serviceType: 'Chlamydia screening under 25s' } },
        should: [
          { match: { venueType: 'Clinic' } },
          { match: { venueType: 'Community' } },
        ],
      },
    },
  ],
};

function getFilter(searchType) {
  return queryFilters[searchType];
}

module.exports = getFilter;
