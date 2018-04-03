const constants = require('../constants');

function getFilter(searchType) {
  const mustNotClause = [
    { match: { name: 'Marie Stopes' } },
    { match: { name: 'Young People Friendly Practice' } },
    { match: { name: 'BPAS' } },
  ];
  if (searchType === constants.searchTypes.sexperts) {
    const mustClause = [
      { match: { type: 'Sexual health information and support' } },
      { match: { venueType: 'Clinic' } },
    ];
    return { mustClause, mustNotClause };
  } else if (searchType === constants.searchTypes.kits16to24) {
    const mustClause = [
      { match: { type: 'Sexual health information and support' } },
      { match: { venueType: 'Community' } },
    ];
    const shouldSubClause =
    {
      bool: {
        minimum_should_match: 1,
        must: { match: { type: 'Chlamydia screening under 25s' } },
        should: [
          { match: { venueType: 'Clinic' } },
          { match: { venueType: 'Community' } },
        ],
      },
    };
    const shouldClause = [
      { bool: { must: mustClause } },
      shouldSubClause,
    ];
    const minShouldMatch = 1;
    return { minShouldMatch, mustNotClause, shouldClause };
  }
  return undefined;
}

module.exports = getFilter;
