const chai = require('chai');

const constants = require('../../../../app/lib/constants');
const queryBuilder = require('../../../../app/lib/azuresearch/queryBuilder');

const expect = chai.expect;

describe('queryBuilder', () => {
  it('should return kitsOver25 query when the query type is kitsOver25', () => {
    const location = {
      lat: 54.12,
      lon: -1.55,
    };
    const searchType = constants.queryTypes.kitsOver25;
    const size = 10;

    const output = queryBuilder(location, searchType, size);

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('ServiceCodesProvided/any(s: s eq \'SRV0531\')');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${location.lon} ${location.lat})')`);
    expect(output).to.have.property('top').and.equal(size);
  });

  it('should return kits16to24 query when the query type is kits16to24', () => {
    const location = {
      lat: 12.34,
      lon: -5.67,
    };
    const searchType = constants.queryTypes.kits16to24;
    const size = 100;

    const output = queryBuilder(location, searchType, size);

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('(ServiceCodesProvided/any(g: g eq \'SRV0267\')) or (ServicesProvided/any(f: f eq \'Sexual health information and support\') and VenueType eq \'Community\') or (ServicesProvided/any(f: f eq \'Chlamydia screening under 25s\') and (VenueType eq \'Clinic\' or VenueType eq \'Community\')) and not search.in(OrganisationName, \'Marie Stopes,Young People Friendly Practice,BPAS\', \',\')');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${location.lon} ${location.lat})')`);
    expect(output).to.have.property('top').and.equal(size);
  });

  it('should return sexperts query when the query type is sexperts', () => {
    const location = {
      lat: 12.34,
      lon: -5.67,
    };
    const searchType = constants.queryTypes.sexperts;
    const size = 100;

    const output = queryBuilder(location, searchType, size);

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('(ServiceCodesProvided/any(g: g eq \'SRV0267\')) or (ServicesProvided/any(f: f eq \'Sexual health information and support\') and VenueType eq \'Community\') or (ServicesProvided/any(f: f eq \'Chlamydia screening under 25s\') and (VenueType eq \'Clinic\' or VenueType eq \'Community\')) and not search.in(OrganisationName, \'Marie Stopes,Young People Friendly Practice,BPAS\', \',\')');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${location.lon} ${location.lat})')`);
    expect(output).to.have.property('top').and.equal(size);
  });
});
