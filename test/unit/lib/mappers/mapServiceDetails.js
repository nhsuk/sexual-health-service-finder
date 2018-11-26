const chai = require('chai');
const mapServiceDetails = require('../../../../app/lib/mappers/mapServiceDetails');

const expect = chai.expect;

describe.only('mapServiceDetails', () => {
  describe('happy path', () => {
    const serviceDetailsText = 'Some text describing the service details';
    const serviceDetails = [
      { ElementText: serviceDetailsText, ElementTitle: 'Service details' },
    ];

    const service = {
      GSD: JSON.stringify(serviceDetails),
    };

    it('should return the service details', () => {
      const result = mapServiceDetails(service);

      expect(result).to.equal(serviceDetailsText);
    });
  });

  describe('no GSD property', () => {
    it('should return undefined', () => {
      const result = mapServiceDetails({});

      expect(result).to.be.undefined;
    });
  });

  describe('GSD with no detail properties to map from', () => {
    const result = mapServiceDetails({ GSD: JSON.stringify([]) });

    it('should return undefined', () => {
      expect(result).to.be.undefined;
    });
  });

  describe('invalid JSON GSD', () => {
    it('should return undefined', () => {
      const result = mapServiceDetails({ GSD: '[{]' });

      expect(result).to.be.undefined;
    });
  });
});

