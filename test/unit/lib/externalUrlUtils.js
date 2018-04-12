const qs = require('querystring');
const chai = require('chai');

const urlUtils = require('../../../app/lib/externalUrlUtils');

const expect = chai.expect;

describe('externalUrlUtils', () => {
  describe('addMapUrl', () => {
    const locationDetails = { location: { lat: 52.4, lon: -1.9 } };

    it('should add additional property to all items in the input list for google maps Url', () => {
      const nameOne = 'place name one';
      const nameTwo = 'place name two';
      const address = {
        addressLines: ['city', 'county', 'line1', 'line2', 'line3'],
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

      const startLocation = `saddr=${locationDetails.location.lat}%2C${locationDetails.location.lon}`;
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

      const results = urlUtils.addMapUrl(locationDetails, inputList);

      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(2);
      expect(results[0].mapUrl).to.be.equal(expectedMapLinkOne);
      expect(results[1].mapUrl).to.be.equal(expectedMapLinkTwo);
    });

    it('should remove any empty, null or undefined address properties', () => {
      const inputList = [{
        address: {
          addressLines: ['', undefined, 'line1', '', null],
          postcode: 'AB12 3CD',
        },
        name: 'name',
      }];

      const destination = 'name,line1,AB12 3CD';
      const encodedQuery = `daddr=${qs.escape(destination)}&near=${qs.escape(destination)}&saddr=${locationDetails.location.lat}%2C${locationDetails.location.lon}`;
      const expectedMapLink = `https://maps.google.com/maps?${encodedQuery}`;

      const results = urlUtils.addMapUrl(locationDetails, inputList);

      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should only include name prior to any blacklisted character', () => {
      const inputList = [{
        address: {
          addressLines: ['', undefined, 'line1', '', null],
          postcode: 'AB12 3CD',
        },
        name: 'name before @ subname',
      }];

      const destination = 'name before,line1,AB12 3CD';
      const encodedQuery = `daddr=${qs.escape(destination)}&near=${qs.escape(destination)}&saddr=${locationDetails.location.lat}%2C${locationDetails.location.lon}`;
      const expectedMapLink = `https://maps.google.com/maps?${encodedQuery}`;

      const results = urlUtils.addMapUrl(locationDetails, inputList);

      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should use coordinates as start address for location searches', () => {
      const inputList = [{
        address: {
          addressLines: ['line1'],
          postcode: 'AB12',
        },
        name: 'name',
      }];
      const destination = 'name,line1,AB12';
      const params = {
        daddr: destination,
        near: destination,
        saddr: `${locationDetails.location.lat},${locationDetails.location.lon}`,
      };
      const expectedMapLink = `https://maps.google.com/maps?${qs.stringify(params)}`;

      const results = urlUtils.addMapUrl(locationDetails, inputList);

      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });
  });

  describe('getChoicesResultsUrlToOnlineTests', () => {
    const location = 'ls1';
    const locationDetails = { location: { lat: 52.4, lon: -1.9 } };
    it('should return undefined if no location', () => {
      const emptyLocation = '';

      const results = urlUtils
        .getChoicesResultsUrlToOnlineTests(locationDetails, emptyLocation);

      expect(results).to.equal(undefined);
    });

    it('should return undefined if no locationDetails', () => {
      const emptyLocationDetails = {};

      const results = urlUtils
        .getChoicesResultsUrlToOnlineTests(emptyLocationDetails, location);

      expect(results).to.equal(undefined);
    });

    it('should return invalid url if malformed locationDetails', () => {
      const emptyLocationDetails = { location: {} };

      const expectedExternalLink = 'https://www.nhs.uk/service-search/Chlamydia-free-online-tests-for-u-25s/ls1/Results/105/undefined/undefined/344/0?distance=25';
      const results = urlUtils
        .getChoicesResultsUrlToOnlineTests(emptyLocationDetails, location);

      expect(results).to.not.equal(undefined);
      expect(results).to.equal(expectedExternalLink);
    });

    it('should return a valid url if location and valid PostcodeLocationDetails', () => {
      const expectedExternalLink = 'https://www.nhs.uk/service-search/Chlamydia-free-online-tests-for-u-25s/ls1/Results/105/-1.9/52.4/344/0?distance=25';
      const results = urlUtils
        .getChoicesResultsUrlToOnlineTests(locationDetails, location);

      expect(results).to.not.equal(undefined);
      expect(results).to.equal(expectedExternalLink);
    });
  });
});
