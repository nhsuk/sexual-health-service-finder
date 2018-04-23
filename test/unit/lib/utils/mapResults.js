const chai = require('chai');

const mapResults = require('../../../../app/lib/utils/mapResults');

const expect = chai.expect;

describe('mapResults', () => {
  describe('should handle missing data', () => {
    it('should return an empty array when the input has no hits', () => {
      const input = { };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output).to.be.empty;
    });

    it('should return an empty array when hits is empty', () => {
      const input = { hits: [] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output).to.be.empty;
    });

    it('should return an array with an undefined entry when the input contains no \'_source\'', () => {
      const input = { hits: [{}] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output.length).to.equal(1);
    });

    it('should work when there is no \'address.\'', () => {
      const input = { hits: [{ _source: { } }] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output[0].address).to.equal(undefined);
    });
  });

  describe('should set properties on the returned services', () => {
    let output;
    const distance = 1.23;
    const rawService = {
      address: { addressLines: ['line1', 'line2'] },
      openingTimes: {
        general: { monday: [{ closes: '23:30', opens: '07:00' }] },
      },
    };

    before('run test', () => {
      const input = { hits: [{ _source: rawService, sort: [distance] }] };
      output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output.length).to.equal(1);
    });

    it('should set \'distance\' as the first value from sort', () => {
      expect(output[0].distance).to.equal(distance);
    });

    it('should set \'address.fullAddress\' based on \'address\'', () => {
      expect(output[0].address.fullAddress).to.be.a('string');
      expect(output[0].address.fullAddress).to.equal('line1, line2');
    });

    it('should set \'openingTimes.formatted\' based on \'openingTimes\'', () => {
      expect(output[0].openingTimes.formatted).to.be.an('array');
      expect(output[0].openingTimes.formatted.length).to.equal(7);
    });
  });
});
