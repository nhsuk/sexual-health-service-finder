const chai = require('chai');
const util = require('util');
const constants = require('../../../../app/lib/constants');
const getFilter = require('../../../../app/lib/utils/getFilteredOutTermsQuery');

const expect = chai.expect;

describe('getFilteredOutTermsQuery', () => {
  it('should return undefined for empty searchType', () => {
    const query = getFilter(undefined);
    expect(query)
      .to.be.equal(
        undefined,
        `"must_not clause not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  describe('for sexperts', () => {
    const searchType = constants.searchTypes.sexperts;

    it('should return mustClause for search type of sexual health professionals', () => {
      const query = getFilter(searchType);
      expect(query.mustClause)
        .to.be.eql(
          [
            { match: { type: 'Sexual health information and support' } },
            { match: { venueType: 'Clinic' } },
          ],
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
  });

  describe('for kits and 16 to 24', () => {
    const searchType = constants.searchTypes.kits16to24;

    it('should return should clause for search type of kits and ages 16 to 24', () => {
      const query = getFilter(searchType);
      expect(query.shouldClause)
        .to.be.eql(
          [
            {
              bool: {
                must: [
                  {
                    match: {
                      type: 'Sexual health information and support',
                    },
                  },
                  {
                    match: {
                      venueType: 'Community',
                    },
                  },
                ],
              },
            },
            {
              bool: {
                minimum_should_match: 1,
                must: {
                  match: {
                    type: 'Chlamydia screening under 25s',
                  },
                },
                should: [
                  {
                    match: {
                      venueType: 'Clinic',
                    },
                  },
                  {
                    match: {
                      venueType: 'Community',
                    },
                  },
                ],
              },
            },
          ],
          `"should clause found in\n${util.inspect(query, { depth: null })}`
        );
    });

    it('should return should clause minimum for search type of kits and ages 16 to 24', () => {
      const query = getFilter(searchType);
      expect(query.minShouldMatch)
        .to.be.eql(
          1,
          `"should min clause found in\n${util.inspect(query, { depth: null })}`
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
  });
});
