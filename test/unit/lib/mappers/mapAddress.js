const chai = require('chai');
const mapAddress = require('../../../../app/lib/mappers/mapAddress');

const expect = chai.expect;

describe('mapAddress', () => {
  it('should return an empty array when empty address', () => {
    const input = {};

    const output = mapAddress(input);

    expect(output).to.be.an('array').and.empty;
  });

  it('should return address with no trailing comma when there is only a single address item', () => {
    const postcode = 'AB12 34CD';
    const input = { Postcode: postcode };

    const output = mapAddress(input);

    expect(output).to.equal(postcode);
  });

  it('should return formatted address for addressLines and postcode', () => {
    const address1 = 'address1';
    const address2 = 'address2';
    const address3 = 'address3';
    const city = 'city';
    const county = 'county';
    const postcode = 'postcode';

    const input = {
      Address1: address1,
      Address2: address2,
      Address3: address3,
      City: city,
      County: county,
      Postcode: postcode,
    };

    const output = mapAddress(input);

    expect(output).to.equal(`${address1}, ${address2}, ${address3}, ${city}, ${county}, ${postcode}`);
  });

  it('should remove undefined, null and empty lines from the address', () => {
    const line1 = 'line1';
    const postcode = 'postcode';
    const input = {
      Address1: line1,
      Address2: '',
      Address3: undefined,
      City: null,
      County: '',
      Postcode: postcode,
    };

    const output = mapAddress(input);

    expect(output).to.equal(`${line1}, ${postcode}`);
  });
});
