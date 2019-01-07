const chai = require('chai');
const messages = require('../../../app/lib/displayUtils/messages');

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
});
