const constants = require('../constants');

function getFilter(searchType) {
  if (searchType === constants.searchTypes.sexperts) {
    const mustNotClause = [
      { match: { name: 'Marie Stopes' } },
      { match: { name: 'Young People Friendly Practice' } },
      { match: { name: 'BPAS' } },
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

