const chai = require('chai');
const formatAddress = require('../../../../app/lib/utils/formatAddress');

const expect = chai.expect;

describe('formatAddress', () => {
  it('should return undefined when empty address', () => {
    const address = {};
    const output = formatAddress(address);
    expect(output).to.be.undefined;
  });

  it('should return undefined when address contains postcode but no addressLines', () => {
    const postcode = 'AB12 34CD';
    const address = { postcode };
    const output = formatAddress(address);
    expect(output).to.equal(postcode);
  });

  it('should return address lines when there is no postcode', () => {
    const line1 = 'line1';
    const line2 = 'line2';
    const address = { addressLines: [line1, line2] };

    const output = formatAddress(address);

    expect(output).to.equal(`${line1}, ${line2}`);
  });

  it('should return formatted address for addressLines and postcode', () => {
    const address = {
      addressLines: ['Merrion Centre - 1st Floor', '50 Merrion Way', 'Leeds', 'West Yorkshire'],
      postcode: 'LS2 8NG',
    };
    const output = formatAddress(address);

    expect(output).to.equal('Merrion Centre - 1st Floor, 50 Merrion Way, Leeds, West Yorkshire, LS2 8NG');
  });

  it('should remove undefined, null and empty lines from the address', () => {
    const line1 = 'line1';
    const postcode = 'postcode';
    const address = {
      addressLines: [null, '', undefined, line1, null, '', undefined],
      postcode,
    };
    const output = formatAddress(address);

    expect(output).to.equal(`${line1}, ${postcode}`);
  });
});

