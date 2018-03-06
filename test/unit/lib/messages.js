const messages = require('../../../app/lib/messages');
const chai = require('chai');

const expect = chai.expect;

describe('messages', () => {
  it('should have an error message for when no answer for symptoms is selected', () => {
    const message = messages.mandatorySelectionMessage();

    expect(message).to.equal('You must choose one of the options');
  });
});
