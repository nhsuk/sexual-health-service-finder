const chai = require('chai');
const serviceDataMapper = require('../../../../app/lib/utils/serviceDataMapper');

const expect = chai.expect;

describe('serviceDataMapper', () => {
  describe('addressFormatter', () => {
    it('should return undefined when empty address', () => {
      const address = {};
      const output = serviceDataMapper.addressFormatter(address);
      expect(output).to.equal(undefined);
    });

    it('should return undefined when address doens\'t contain addressLines', () => {
      const address = { postcode: 'LS2 8NG' };
      const output = serviceDataMapper.addressFormatter(address);
      expect(output).to.equal(undefined);
    });

    it('should return undefined address doens\'t contain postcode', () => {
      const address = { addressLines: ['Merrion Centre - 1st Floor', '50 Merrion Way', 'Leeds', 'West Yorkshire'] };
      const output = serviceDataMapper.addressFormatter(address);
      expect(output).to.equal(undefined);
    });

    it('should return formatted address for addressLines and postcode', () => {
      const address = {
        addressLines: ['Merrion Centre - 1st Floor', '50 Merrion Way', 'Leeds', 'West Yorkshire'],
        postcode: 'LS2 8NG',
      };
      const output = serviceDataMapper.addressFormatter(address);
      expect(output).to.equal('Merrion Centre - 1st Floor, 50 Merrion Way, Leeds, West Yorkshire, LS2 8NG');
    });
  });
});
