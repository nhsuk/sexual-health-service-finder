const chai = require('chai');
const VError = require('verror').VError;

const constants = require('../../../../app/lib/constants');
const queryBuilder = require('../../../../app/lib/search/queryBuilder');

const expect = chai.expect;

describe('queryBuilder', () => {
  it('should return kitsOver25 query when the query type is kitsOver25', () => {
    const searchOrigin = { location: { lat: 54.12, lon: -1.55 } };
    const searchType = constants.queryTypes.kitsOver25;
    const size = 10;

    const output = queryBuilder(searchOrigin, searchType, size);

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('ServiceCodesProvided/any(s: s eq \'SRV0531\')');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`);
    expect(output).to.have.property('select').and.equal('OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, Metrics, GSD, OpeningTimes');
    expect(output).to.have.property('top').and.equal(size);
  });

  it('should return kits16to24 query when the query type is kits16to24', () => {
    const searchOrigin = { location: { lat: 12.34, lon: -5.67 } };
    const searchType = constants.queryTypes.kits16to24;
    const size = 100;

    const output = queryBuilder(searchOrigin, searchType, size);

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('(ServiceCodesProvided/any(g: g eq \'SRV0267\')) or (ServicesProvided/any(f: f eq \'Sexual health information and support\') and VenueType eq \'Community\') or (ServicesProvided/any(f: f eq \'Chlamydia screening under 25s\') and search.in(VenueType, \'Clinic,Community\')) and not (search.ismatch(\'Marie Stopes\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'Young People Friendly Practice\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'BPAS\', \'OrganisationName\', \'simple\', \'all\'))');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`);
    expect(output).to.have.property('select').and.equal('OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, Metrics, GSD, OpeningTimes');
    expect(output).to.have.property('top').and.equal(size);
  });

  it('should return sexperts query when the query type is sexperts', () => {
    const searchOrigin = { location: { lat: 12.34, lon: -5.67 } };
    const searchType = constants.queryTypes.sexperts;
    const size = 100;

    const output = queryBuilder(searchOrigin, searchType, size);

    expect(output).to.be.an('object');
    expect(output).to.have.property('count').and.equal(true);
    expect(output).to.have.property('filter').and.equal('ServicesProvided/any(s: s eq \'Sexual health information and support\') and VenueType eq \'Clinic\' and not (search.ismatch(\'Marie Stopes\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'Young People Friendly Practice\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'BPAS\', \'OrganisationName\', \'simple\', \'all\'))');
    expect(output).to.have.property('orderby').and.equal(`geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`);
    expect(output).to.have.property('select').and.equal('OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, Metrics, GSD, OpeningTimes');
    expect(output).to.have.property('top').and.equal(size);
  });

  describe('unknown type', () => {
    it('should throw VError', () => {
      const unknownType = 'unknown';
      expect(() => queryBuilder({}, unknownType, 10)).to.throw(VError, `Unknown queryType: ${unknownType}`);
    });
  });
});
