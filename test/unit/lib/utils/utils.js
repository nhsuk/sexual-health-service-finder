const chai = require('chai');
const constants = require('../../../../app/lib/constants');
const utils = require('../../../../app/lib/utils/utils');

const expect = chai.expect;

describe('utils', () => {
  describe('isProfessionalChoice', () => {
    it('should return true when the query is related to professionals and origin is symptoms', () => {
      const query = {
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = utils.isProfessionalChoice(query);
      expect(output).to.equal(true);
    });

    it('should return true when the query is related to professionals and origin is under 16', () => {
      const query = {
        origin: constants.serviceChoices.under16,
        type: constants.serviceTypes.professional,
      };
      const output = utils.isProfessionalChoice(query);
      expect(output).to.equal(true);
    });

    it('should return true when the query is related to professionals and origin is 16 to 24', () => {
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.professional,
      };
      const output = utils.isProfessionalChoice(query);
      expect(output).to.equal(true);
    });

    it('should return true when the query is related to professionals and origin is over 25', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.professional,
      };
      const output = utils.isProfessionalChoice(query);
      expect(output).to.equal(true);
    });

    it('should return false if the query is related to kits', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.kit,
      };
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
});
