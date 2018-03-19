const chai = require('chai');
const util = require('util');
const constants = require('../../../app/lib/constants');
const esGeoQueryBuilder = require('../../../app/lib/esGeoQueryBuilder');

const expect = chai.expect;

function findKeyValuePair(obj, searchKey, searchValue) {
  return Object.keys(obj).some((key) => {
    const value = obj[key];

    if (typeof value === 'object') {
      if (findKeyValuePair(value, searchKey, searchValue)) {
        return true;
      }
    }

    if (key === searchKey && value === searchValue) {
      return true;
    }

    return false;
  });
}

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

  xit('should populate the query with the location', () => {
    const query = esGeoQueryBuilder.build(location, searchType, size);
    expect(findKeyValuePair(query, 'location.coordinates', location))
      .to.be.equal(
        true,
        `"query: ${location}" not found in\n${util.inspect(query, { depth: null })}`
      );
  });

  it('should return the size as per the setting in the locale', () => {
    const res = { locals: { resultsReturnedCount: 20 } };
    const query = esGeoQueryBuilder.build(location, searchType, res.locals.resultsReturnedCount);
    expect(query.body.size).to.be.equal(20);
  });
});
