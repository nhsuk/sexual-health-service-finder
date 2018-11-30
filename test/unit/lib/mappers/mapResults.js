const chai = require('chai');

const formatTimeString = require('../../../../app/lib/formatters/formatTimeString');
const mapResults = require('../../../../app/lib/mappers/mapResults');

const expect = chai.expect;

describe('mapResults', () => {
  describe('should handle missing data', () => {
    it('should return an empty array when the input has no value', () => {
      const input = { };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output).to.be.empty;
    });

    it('should return an empty array when value is empty', () => {
      const input = { value: [] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output).to.be.empty;
    });

    it('should return an array with an undefined entry when the input contains an empty record', () => {
      const input = { value: [{}] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output.length).to.equal(1);
      expect(output[0].address).to.be.an('array').and.empty;
      expect(output[0].contacts).to.be.undefined;
      expect(output[0].name).to.be.undefined;
      expect(output[0].serviceDetails).to.be.undefined;
      expect(output[0].openingTimes).to.be.undefined;
    });
  });

  describe('should set properties on the returned services', () => {
    let output;
    let result;
    const orgName = 'the name of the organisation';
    const serviceDetailsText = 'some information about the service';
    const telephoneNumber = '0800 123456';
    const contacts = [{ OrganisationContactMethodType: 'Telephone', OrganisationContactValue: telephoneNumber }];
    const gsd = [{ ElementText: serviceDetailsText, ElementTitle: 'Service details' }];
    const sundayOpeningHours = '10:30-16:00';
    const [sundayOpens, sundayCloses] = sundayOpeningHours.split('-');
    const openingTimes = [{ Times: sundayOpeningHours, WeekDay: 'Sunday' }];
    // const distance = 1.23;
    const rawService = {
      Address1: 'Address1',
      Address2: 'Address2',
      Address3: 'Address3',
      City: 'City',
      Contacts: JSON.stringify(contacts),
      County: 'County',
      GSD: JSON.stringify(gsd),
      OpeningTimes: JSON.stringify(openingTimes),
      OrganisationName: orgName,
      Postcode: 'Postcode',
    };

    before('run test', () => {
      const input = { value: [rawService] };
      output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output.length).to.equal(1);
      result = output[0];
    });

    // TODO: This needs to be calculated
    // it('should set \'distance\' as the first value from sort', () => {
    //   expect(result.distance).to.equal(distance);
    // });

    it('should set \'address\' based on the Address property', () => {
      expect(result.address).to.be.a('string');
      expect(result.address).to.equal('Address1, Address2, Address3, City, County, Postcode');
    });

    it('should set \'contacts\' based on the Contacts property', () => {
      expect(result.contacts).to.be.an('object');
      expect(result.contacts).to.have.property('telephoneNumber', telephoneNumber);
    });

    it('should set \'name\' based on the OrganisationName property', () => {
      expect(result.name).to.be.a('string');
      expect(result.name).to.equal(orgName);
    });

    it('should set \'openingTimes.formatted\' based on the OpeningTimes property', () => {
      expect(result.openingTimes.formatted).to.be.an('array');
      expect(result.openingTimes.formatted.length).to.equal(7);
      const sundayOpeningTimes = result.openingTimes.formatted[6];
      expect(sundayOpeningTimes).to.have.property('day');
      expect(sundayOpeningTimes).to.have.property('openingTimes');
      expect(sundayOpeningTimes.openingTimes).to.be.an('array');
      expect(sundayOpeningTimes.openingTimes[0].opens).to.equal(formatTimeString(sundayOpens));
      expect(sundayOpeningTimes.openingTimes[0].closes).to.equal(formatTimeString(sundayCloses));
    });

    it('should set \'serviceDetails\' based on the GSD property', () => {
      expect(result.serviceDetails).to.be.a('string');
      expect(result.serviceDetails).to.equal(serviceDetailsText);
    });
  });
});
