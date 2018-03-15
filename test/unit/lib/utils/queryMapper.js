const queryMapper = require('../../../../app/lib/utils/queryMapper');
const constants = require('../../../../app/lib/constants');
const chai = require('chai');

const expect = chai.expect;

describe('queryMapper', () => {
  describe('getLocationHeading', () => {
    it('should return undefined when empty query', () => {
      const query = {};
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal(undefined);
    });

    it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
      const query = {
        origin: constants.SERVICE_CHOICES.symptoms,
        type: constants.SERVICE_TYPES.professional,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to see a sexual health professional?');
    });

    it('should return a free kit message when the query is related to kit and age between 16 and 25', () => {
      const query = {
        origin: constants.SERVICE_CHOICES['16to25'],
        type: constants.SERVICE_TYPES.kit,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to collect your free test kit?');
    });

    it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
      const query = {
        origin: constants.SERVICE_CHOICES.over25,
        type: constants.SERVICE_TYPES.kit,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to collect your test kit?');
    });
  });

  describe('mapServiceType', () => {
    it('should return the query type if type is set', () => {
      const query = {
        type: constants.SERVICE_TYPES.professional,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.SERVICE_TYPES.professional);
    });

    it('should map to professional service type if query contains age is under 16', () => {
      const query = {
        age: constants.AGE.under16,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.SERVICE_TYPES.professional);
    });

    it('should map to professional service type if query contains symptoms', () => {
      const query = {
        symptoms: constants.SYMPTOMS.yes,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.SERVICE_TYPES.professional);
    });

    it('should map to undefined if query contains no symptoms', () => {
      const query = {
        symptoms: constants.SYMPTOMS.false,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(undefined);
    });

    it('should map to undefined if query contains age is over 16', () => {
      const query = {
        age: constants.AGE.over25,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(undefined);
    });
  });

  describe('mapServiceChoice', () => {
    it('should return the query origin if origin is set', () => {
      const query = {
        origin: constants.SERVICE_CHOICES.symptoms,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.SERVICE_CHOICES.symptoms);
    });

    it('should map to under 16 service choice if query contains age is under 16', () => {
      const query = {
        age: constants.AGE.under16,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.SERVICE_CHOICES.under16);
    });

    it('should map to symptoms service choice if query contains symptoms', () => {
      const query = {
        symptoms: constants.SYMPTOMS.yes,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.SERVICE_CHOICES.symptoms);
    });

    it('should map to undefined if query contains no symptoms', () => {
      const query = {
        symptoms: constants.SYMPTOMS.false,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(undefined);
    });

    it('should map to undefined if query contains age is over 16', () => {
      const query = {
        age: constants.AGE.over25,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(undefined);
    });
  });
});
