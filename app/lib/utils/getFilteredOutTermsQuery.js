const constants = require('../constants');

function getFilter(searchType) {
  const mustNotClause = [
    { match: { name: 'Marie Stopes' } },
    { match: { name: 'Young People Friendly Practice' } },
    { match: { name: 'BPAS' } },
  ];

  if (searchType === constants.searchTypes.sexperts) {
    return {
      must: [
        { match: { type: 'Sexual health information and support' } },
        { match: { venueType: 'Clinic' } },
      ],
      must_not: mustNotClause,
    };
  } else if (searchType === constants.searchTypes.kits16to24) {
    return {
      minimum_should_match: 1,
      must_not: mustNotClause,
      should: [
        {
          bool: {
            must: [
              { match: { type: 'Sexual health information and support' } },
              { match: { venueType: 'Community' } },
            ],
          },
        },
        {
          bool: {
            minimum_should_match: 1,
            must: { match: { type: 'Chlamydia screening under 25s' } },
            should: [
              { match: { venueType: 'Clinic' } },
              { match: { venueType: 'Community' } },
            ],
          },
        },
      ],
    };
  }
  return undefined;
}

module.exports = getFilter;
