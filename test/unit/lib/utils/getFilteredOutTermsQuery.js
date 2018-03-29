const chai = require('chai');
const util = require('util');
const constants = require('../../../../app/lib/constants');
const getFilter = require('../../../../app/lib/utils/getFilteredOutTermsQuery');

const expect = chai.expect;

describe('getFilteredOutTermsQuery', () => {
  const searchType = constants.searchTypes.sexperts;

  it('should return mustClause for search type of sexual health professionals', () => {
    const query = getFilter(searchType);
    expect(query.mustClause)
      .to.be.eql(
        {
          match: {
            venueType: 'Clinic',
          },
        },
        `"must clause found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should return mustNotClause for search type of sexual health professionals', () => {
    const query = getFilter(searchType);
    expect(query.mustNotClause)
      .to.be.eql(
        [
          { match: { name: 'Marie Stopes' } },
          { match: { name: 'Young People Friendly Practice' } },
          { match: { name: 'BPAS' } },
        ],
        `"must not clause found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should return undefined for empty searchType', () => {
    const query = getFilter(undefined);
    expect(query)
      .to.be.equal(
        undefined,
        `"must_not clause not found in\n${util.inspect(query, { depth: null })}`
      );
  });
});
