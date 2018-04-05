const chai = require('chai');
const constants = require('../../../../app/lib/constants');
const queryMapper = require('../../../../app/lib/utils/queryMapper');

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
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to see a sexual health professional?');
    });

    it('should return a free kit message when the query is related to kit and age between 16 and 24', () => {
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to collect your free test kit?');
    });

    it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to buy your test kit?');
    });

    it('should return a redirect message when the query is related to online', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.online,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('redirect');
    });
  });

  describe('getResultsHeading', () => {
    const location = 'ls1';
    it('should return undefined when empty query', () => {
      const query = {};
      const output = queryMapper.getResultsHeading(query, location);
      expect(output).to.equal(undefined);
    });

    it('should return undefined when empty location', () => {
      const emptyLocation = undefined;
      const query = {
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.getResultsHeading(query, emptyLocation);
      expect(output).to.equal(undefined);
    });

    it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
      const query = {
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.getResultsHeading(query, location);
      expect(output).to.equal('Sexual health professionals near \'LS1\'');
    });

    it('should return a free kit message when the query is related to kit and age between 16 and 24', () => {
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getResultsHeading(query, location);
      expect(output).to.equal('Where you can pick up a free test kit near \'LS1\'');
    });

    it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getResultsHeading(query, location);
      expect(output).to.equal('Where you can buy a test near \'LS1\'');
    });
  });

  describe('getResultsExplanation', () => {
    it('should return undefined when empty query', () => {
      const query = {};
      const output = queryMapper.getResultsExplanation(query);
      expect(output).to.equal(undefined);
    });

    it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
      const query = {
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.getResultsExplanation(query);
      expect(output).to.equal('Here is a list of places where you can get tested by a sexual health professional.');
    });

    it('should return a free kit message when the query is related to kit and age between 16 and 24', () => {
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getResultsExplanation(query);
      expect(output).to.equal('You can pick up a chlamydia test kit from any of the places below. You\'ll take your own samples and ' +
        'send them by Freepost to be tested. You\'ll usually get the results within 2 weeks.');
    });

    it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getResultsExplanation(query);
      expect(output).to.equal('You can buy a chlamydia test kit from any of the places below. You\'ll take your own samples and send ' +
        'them by Freepost to be tested. You\'ll usually get the results within 2 weeks.');
    });
  });

  describe('mapServiceType', () => {
    it('should return the query type if type is set', () => {
      const query = {
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.serviceTypes.professional);
    });

    it('should map to professional service type if query contains age is under 16', () => {
      const query = {
        age: constants.age.under16,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.serviceTypes.professional);
    });

    it('should map to professional service type if query contains symptoms', () => {
      const query = {
        symptoms: constants.symptoms.yes,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.serviceTypes.professional);
    });

    it('should map to undefined if query contains no symptoms', () => {
      const query = {
        symptoms: constants.symptoms.false,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(undefined);
    });

    it('should map to undefined if query contains age is over 16', () => {
      const query = {
        age: constants.age.over25,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(undefined);
    });
  });

  describe('mapServiceChoice', () => {
    it('should return the query origin if origin is set', () => {
      const query = {
        origin: constants.serviceChoices.symptoms,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.symptoms);
    });

    it('should map to under 16 service choice if query contains age is under 16', () => {
      const query = {
        age: constants.age.under16,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.under16);
    });

    it('should map to symptoms service choice if query contains symptoms', () => {
      const query = {
        symptoms: constants.symptoms.yes,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.symptoms);
    });

    it('should map to undefined if query contains no symptoms', () => {
      const query = {
        symptoms: constants.symptoms.false,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(undefined);
    });

    it('should map to 16 to 24 if query contains age is between 16 and 24', () => {
      const query = {
        age: constants.age['16to24'],
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices['16to24']);
    });

    it('should map to over 25 if query contains age is over 25', () => {
      const query = {
        age: constants.age.over25,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.over25);
    });

    it('should map to undefined if no age or symptoms', () => {
      const query = {
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(undefined);
    });
  });
});
