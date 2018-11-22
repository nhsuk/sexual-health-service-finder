const chai = require('chai');

const mapResults = require('../../../../app/lib/mappers/mapResults');

const expect = chai.expect;

describe('mapResults', () => {
  describe('should handle missing data', () => {
    it('should return an empty array when the input has no value', () => {
      const input = { };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output).to.be.empty;
    });

    it('should return an empty array when value is empty', () => {
      const input = { value: [] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output).to.be.empty;
    });

    it('should return an array with an undefined entry when the input contains an empty record', () => {
      const input = { value: [{}] };
      const output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output.length).to.equal(1);
    });

    // it('should work when there is no \'address\'', () => {
    //   const input = { hits: [{ _source: { } }] };
    //   const output = mapResults(input);

    //   expect(output).to.be.an('array');
    //   expect(output[0].address).to.equal(undefined);
    // });
  });

  describe('should set properties on the returned services', () => {
    let output;
    // const distance = 1.23;
    const rawService = {
      Address1: 'Address1',
      Address2: 'Address2',
      Address3: 'Address3',
      City: 'City',
      County: 'County',
      Postcode: 'Postcode',
      // openingTimes: {
      //   general: { monday: [{ closes: '23:30', opens: '07:00' }] },
      // },
    };

    before('run test', () => {
      const input = { value: [rawService] };
      output = mapResults(input);

      expect(output).to.be.an('array');
      expect(output.length).to.equal(1);
    });

    // TODO: This needs to be calculated
    // it('should set \'distance\' as the first value from sort', () => {
    //   expect(output[0].distance).to.equal(distance);
    // });

    it('should set \'address\' based on the Address properties', () => {
      expect(output[0].address).to.be.a('string');
      expect(output[0].address).to.equal('Address1, Address2, Address3, City, County, Postcode');
    });

    // TODO: Add tests for the mapping of the name, the contacts and the service details

    // TODO: Add this back when the opening times are included in mapResults
    // it('should set \'openingTimes.formatted\' based on \'openingTimes\'', () => {
    //   expect(output[0].openingTimes.formatted).to.be.an('array');
    //   expect(output[0].openingTimes.formatted.length).to.equal(7);
    // });
  });
});
