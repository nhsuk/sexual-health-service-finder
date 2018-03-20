require('object.values').shim();
const qs = require('querystring');
const chai = require('chai');

const mapLink = require('../../../app/lib/mapLink');

const expect = chai.expect;

describe('mapLink', () => {
  describe('addUrl', () => {
    const postcodeLocationDetails = { location: { lat: 52.4, lon: -1.9 } };

    it(
      'should add an additional property to all items in the input list with the google maps Url',
      () => {
        const nameOne = 'place name one';
        const nameTwo = 'place name two';
        const address = {
          city: 'city',
          county: 'county',
          line1: 'line1',
          line2: 'line2',
          line3: 'line3',
          postcode: 'AB12 3CD',
        };
        const inputList = [{
          address,
          name: nameOne,
        },
        {
          address,
          name: nameTwo,
        }];

        const startLocation = `saddr=${postcodeLocationDetails.location.lat}%2C${postcodeLocationDetails.location.lon}`;
        const nameAndAddressOne = `${nameOne},${Object.values(address).join()}`;
        const nameAndAddressOneEncoded = qs.escape(nameAndAddressOne);
        const destinationOne = `daddr=${nameAndAddressOneEncoded}`;
        const nearOne = `near=${nameAndAddressOneEncoded}`;
        const nameAndAddressTwo = `${nameTwo},${Object.values(address).join()}`;
        const nameAndAddressTwoEncoded = qs.escape(nameAndAddressTwo);
        const destinationTwo = `daddr=${nameAndAddressTwoEncoded}`;
        const nearTwo = `near=${nameAndAddressTwoEncoded}`;
        const encodedQueryOne = `${destinationOne}&${nearOne}&${startLocation}`;
        const encodedQueryTwo = `${destinationTwo}&${nearTwo}&${startLocation}`;
        const expectedMapLinkOne = `https://maps.google.com/maps?${encodedQueryOne}`;
        const expectedMapLinkTwo = `https://maps.google.com/maps?${encodedQueryTwo}`;

        const results = mapLink.addUrl(postcodeLocationDetails, inputList);

        expect(results).to.not.be.undefined;
        expect(results).to.be.an('array');
        expect(results.length).to.be.equal(2);
        expect(results[0].mapUrl).to.be.equal(expectedMapLinkOne);
        expect(results[1].mapUrl).to.be.equal(expectedMapLinkTwo);
      }
    );

    it('should remove any empty, null or undefined address properties', () => {
      const inputList = [{
        address: {
          city: '',
          county: undefined,
          line1: 'line1',
          line2: '',
          line3: null,
          postcode: 'AB12 3CD',
        },
        name: 'name',
      }];

      const destination = 'name,line1,AB12 3CD';
      const encodedQuery = `daddr=${qs.escape(destination)}&near=${qs.escape(destination)}&saddr=${postcodeLocationDetails.location.lat}%2C${postcodeLocationDetails.location.lon}`;
      const expectedMapLink = `https://maps.google.com/maps?${encodedQuery}`;

      const results = mapLink.addUrl(postcodeLocationDetails, inputList);

      expect(results).to.not.be.undefined;
      expect(results).to.not.be.equal(undefined);
      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should not add name as a property if it contains a special symbol', () => {
      const inputList = [{
        address: {
          city: '',
          county: undefined,
          line1: 'line1',
          line2: '',
          line3: null,
          postcode: 'AB12 3CD',
        },
        name: 'name @ subname',
      }];

      const destination = 'line1,AB12 3CD';
      const encodedQuery = `daddr=${qs.escape(destination)}&near=${qs.escape(destination)}&saddr=${postcodeLocationDetails.location.lat}%2C${postcodeLocationDetails.location.lon}`;
      const expectedMapLink = `https://maps.google.com/maps?${encodedQuery}`;

      const results = mapLink.addUrl(postcodeLocationDetails, inputList);

      expect(results).to.not.equal(undefined);
      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should use coordinates as start address for location searches', () => {
      const inputList = [{
        address: {
          line1: 'line1',
        },
        name: 'name',
      }];
      const destination = 'name,line1';
      const params = {
        daddr: destination,
        near: destination,
        saddr: `${postcodeLocationDetails.location.lat},${postcodeLocationDetails.location.lon}`,
      };
      const expectedMapLink = `https://maps.google.com/maps?${qs.stringify(params)}`;

      const results = mapLink.addUrl(postcodeLocationDetails, inputList);

      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });
  });
});
