const chai = require('chai');
const util = require('util');
const constants = require('../../../../app/lib/constants');
const coreQuery = require('../../../../app/lib/elasticsearch/coreQuery');

const expect = chai.expect;

const mustNotClause = [
  { match: { name: 'Marie Stopes' } },
  { match: { name: 'Young People Friendly Practice' } },
  { match: { name: 'BPAS' } },
];

describe('coreQuery', () => {
  it('should return undefined for empty searchType', () => {
    const query = coreQuery(undefined);
    expect(query)
      .to.be.equal(
        undefined,
        `"must_not clause not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  describe('for sexperts', () => {
    const searchType = constants.searchTypes.sexperts;

    it('should return mustClause for search type of sexual health professionals', () => {
      const query = coreQuery(searchType);
      expect(query.must)
        .to.be.eql(
          [
            { match: { serviceType: 'Sexual health information and support' } },
            { match: { venueType: 'Clinic' } },
          ],
          `"must clause found in\n${util.inspect(query, { depth: null })}`
        );
    });

    it('should return mustNotClause for search type of sexual health professionals', () => {
      const query = coreQuery(searchType);
      expect(query.must_not)
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

  describe('for kits and over 25', () => {
    const searchType = constants.searchTypes.kitsOver25;

    it('should return should clause for search type of kits and over 25', () => {
      const query = coreQuery(searchType);
      expect(query)
        .to.be.eql({
          must: [
            { match: { serviceType: 'SRV0531' } },
          ],
        });
    });
  });

  describe('for kits and 16 to 24', () => {
    const searchType = constants.searchTypes.kits16to24;

    it('should return should clause for search type of kits and ages 16 to 24', () => {
      const query = coreQuery(searchType);
      expect(query.should)
        .to.be.eql(
          [
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
                  {
                    match: {
                      serviceType: 'Sexual health information and support',
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
                    serviceType: 'Chlamydia screening under 25s',
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
      const query = coreQuery(searchType);
      expect(query.minimum_should_match)
        .to.be.eql(
          1,
          `"should min clause found in\n${util.inspect(query, { depth: null })}`
        );
    });

    it('should return mustNotClause for search type of sexual health professionals', () => {
      const query = coreQuery(searchType);
      expect(query.must_not)
        .to.be.eql(mustNotClause, `"must not clause found in\n${util.inspect(query, { depth: null })}`);
    });
  });
});
