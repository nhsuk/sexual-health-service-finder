const chai = require('chai');
const util = require('util');
const constants = require('../../../app/lib/constants');
const esGeoQueryBuilder = require('../../../app/lib/esGeoQueryBuilder');

const expect = chai.expect;

describe('esGeoQueryBuilder', () => {
  const location = {
    lat: 52.71283117402151,
    lon: -2.74961048457895,
  };
  const searchType = constants.searchTypes.sexperts;
  const size = 10;
  it('should return an object', () => {
    const query = esGeoQueryBuilder.build(location, searchType, size);
    expect(query).to.be.an('object');
  });

  it('should populate the query with the must clause for non empty searchType', () => {
    const query = esGeoQueryBuilder.build(location, searchType);
    expect(query.body.query.bool.must)
      .to.not.equal(
        undefined,
        `"must clause found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should not populate the query with the must clause for empty searchType', () => {
    const query = esGeoQueryBuilder.build(location, undefined, size);
    expect(query.body.query.bool.must)
      .to.be.equal(
        undefined,
        `"must clause not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should populate the query with the must_not clause for non empty searchType', () => {
    const query = esGeoQueryBuilder.build(location, searchType, size);
    expect(query.body.query.bool.must_not)
      .to.not.equal(
        undefined,
        `"must_not clause found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should not populate the query with the must_not clause for empty searchType', () => {
    const query = esGeoQueryBuilder.build(location, undefined, size);
    expect(query.body.query.bool.must_not)
      .to.be.equal(
        undefined,
        `"must_not clause not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should return the size as per the setting in the locale', () => {
    const res = { locals: { resultsReturnedCount: 20 } };
    const query = esGeoQueryBuilder.build(location, searchType, res.locals.resultsReturnedCount);
    expect(query.body.size).to.be.equal(20);
  });
});
