const chai = require('chai');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;

describe('messages', () => {
  describe('mandatory selection message', () => {
    it('should have an error message for when no answer for symptoms is selected', () => {
      const message = messages.mandatorySelectionMessage();
      expect(message).to.equal('You must choose one of the options.');
    });
  });

  describe('empty postcode message', () => {
    it('should have an error message for an empty postcode', () => {
      const message = messages.emptyPostcodeMessage();
      expect(message).to.contain('You must enter a postcode.');
    });
  });

  describe('invalid postcode message', () => {
    it('should have an error message for and invalid postcode', () => {
      const message = messages.invalidPostcodeMessage('LS1 123');
      expect(message).to.contain('We can\'t find the postcode \'LS1 123\'. Check the postcode is correct and try again.');
    });
  });

  describe('technical error message', () => {
    it('should have an error message for technical errors', () => {
      const message = messages.technicalProblems();
      expect(message).to.contain('Sorry, we are experiencing technical problems.');
    });
  });
});
