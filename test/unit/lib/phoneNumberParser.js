const chai = require('chai');

const phoneNumberParser = require('../../../app/lib/phoneNumberParser');

const expect = chai.expect;

describe('parse phone number', () => {
  it('should reformat phone number to UK standard', () => {
    const number = phoneNumberParser('08 00 12 34 56 7');
    expect(number).to.equal('0800 123 4567');
  });

  it('should return string unchanged if invalid', () => {
    const notReallyANumber = '0115 930 1055/Appointments 0115 9301105';
    const number = phoneNumberParser(notReallyANumber);
    expect(number).to.equal(notReallyANumber);
  });

  it('should gracefully handle undefined', () => {
    const number = phoneNumberParser(undefined);
    expect(number).to.be.undefined;
  });
});
