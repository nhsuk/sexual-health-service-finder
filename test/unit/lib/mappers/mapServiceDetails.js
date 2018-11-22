const chai = require('chai');
const mapServiceDetails = require('../../../../app/lib/mappers/mapServiceDetails');

const expect = chai.expect;

describe('mapServiceDetails', () => {
  describe('happy path', () => {
    const serviceDetailsText = 'Some text describing the service details';
    const openingTimesText = 'Some text describing the open times';
    const venueTypeText = 'Some text describing the venue type';
    const serviceDetails = [
      { ElementText: serviceDetailsText, ElementTitle: 'Service details' },
      { ElementText: openingTimesText, ElementTitle: 'Opening times' },
      { ElementText: venueTypeText, ElementTitle: 'Venue Type' },
    ];

    let mappedServiceDetails;
    const service = {
      GSD: JSON.stringify(serviceDetails),
    };

    before('execute function', () => {
      mappedServiceDetails = mapServiceDetails(service);
    });

    it('should return the service details', () => {
      expect(mappedServiceDetails.serviceDetails).to.equal(serviceDetailsText);
    });

    it('should return the opening times', () => {
      expect(mappedServiceDetails.openingTimes).to.equal(openingTimesText);
    });

    it('should return the venue type', () => {
      expect(mappedServiceDetails.venueType).to.equal(venueTypeText);
    });
  });

  describe('no GSD to map from', () => {
    it('should not add a serviceDetails property', () => {
      const mappedServiceDetails = mapServiceDetails({});

      expect(mappedServiceDetails).to.not.have.property('serviceDetails');
    });
  });

  describe('GSD with no detail properties to map from', () => {
    const mappedServiceDetails = mapServiceDetails({ GSD: JSON.stringify([]) });

    it('should not add a serviceDetails property when there are no service details', () => {
      expect(mappedServiceDetails).to.not.have.property('email');
    });

    it('should not add a openingTimes property when there are no opening times details', () => {
      expect(mappedServiceDetails).to.not.have.property('openingTimes');
    });

    it('should not add a venueType property when there are no venue type details', () => {
      expect(mappedServiceDetails).to.not.have.property('venueType');
    });
  });

  describe('invalid JSON GSD', () => {
    it('should return undefined', () => {
      const mappedServiceDetails = mapServiceDetails({ GSD: '[{]' });

      expect(mappedServiceDetails).to.be.undefined;
    });
  });
});

