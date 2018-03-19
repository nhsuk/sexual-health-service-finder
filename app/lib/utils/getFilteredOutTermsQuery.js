const constants = require('../constants');

function getFilter(searchType) {
  if (searchType === constants.searchTypes.sexperts) {
    const mustNotClause = [
      { match: { name: 'Marie Stopes' } },
      { match: { name: 'Young People Friendly Practice' } },
      { match: { name: 'MESMAC' } },
      { match: { name: 'BPAS' } },
      { match: { name: 'HIV' } },
    ];
    const mustClause = {
      match: {
        venueType: 'Clinic',
      },
    };
    return { mustClause, mustNotClause };
  }
  return undefined;
}

module.exports = getFilter;

