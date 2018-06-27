const chai = require('chai');
const constants = require('../../../../app/lib/constants');
const utils = require('../../../../app/lib/utils/utils');

const expect = chai.expect;

describe('utils', () => {
  describe('isProfessionalChoice', () => {
    it('should return true when the query is for professionals', () => {
      const query = {
        type: constants.serviceTypes.professional,
      };
      const output = utils.isProfessionalChoice(query);
      expect(output).to.equal(true);
    });

    it('should return false if the query is not for professionals', () => {
      const query = { };
      const output = utils.isProfessionalChoice(query);
      expect(output).to.equal(false);
    });
  });

  describe('getResultsInternalUrl', () => {
    it('should return a link with kit when the type is related to professional', () => {
      const location = 'ls1';
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.professional,
      };

      const expectedInternalUrl = `${constants.siteRoot}/results?location=ls1&type=${constants.serviceTypes.kit}&origin=${constants.serviceChoices['16to24']}`;

      const output = utils.getResultsInternalUrl(query, location);
      expect(output).to.equal(expectedInternalUrl);
    });

    it('should return a link with professional when the type is related to kit', () => {
      const location = 'ls1';
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.kit,
      };

      const expectedInternalUrl = `${constants.siteRoot}/results?location=ls1&type=${constants.serviceTypes.professional}&origin=${constants.serviceChoices['16to24']}`;

      const output = utils.getResultsInternalUrl(query, location);
      expect(output).to.equal(expectedInternalUrl);
    });
  });

  describe('areEqual', () => {
    it('should ignore case', () => {
      const queryItem = 'professional';
      const item = 'ProfeSsional';

      const output = utils.areEqual(queryItem, item);
      expect(output).to.equal(true);
    });

    it('should not ignore misspellings', () => {
      const queryItem = 'professional';
      const item = 'ProfeSional';

      const output = utils.areEqual(queryItem, item);
      expect(output).to.equal(false);
    });
  });

  describe('joinTruthyValues', () => {
    it('should return a string containing only truthy values', () => {
      const falseyValues = [null, undefined, 0, '', false];
      const truthyValues = ['a', 1, true];
      const input = falseyValues.concat(truthyValues);

      const output = utils.joinTruthyValues(input);

      expect(output).to.be.a('string');
      expect(output).to.equal('a, 1, true');
    });
  });

  describe('trim', () => {
    it('should remove leading and trailing whitespace', () => {
      const result = utils.trim('  test  ');
      expect(result).to.equal('test');
    });
    it('should gracefully handled undefined values', () => {
      const result = utils.trim(undefined);
      expect(result).to.equal(undefined);
    });
  });
});
