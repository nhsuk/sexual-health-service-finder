const qs = require('querystring');
const chai = require('chai');

const urlUtils = require('../../../app/lib/externalUrlUtils');

const expect = chai.expect;

describe('externalUrlUtils', () => {
  describe('addMapUrl', () => {
    const location = 'location';

    it('should add additional property to all items in the input list for google maps Url', () => {
      const address = {
        addressLines: ['city', 'county', 'line1', 'line2', 'line3'],
        postcode: 'AB12 3CD',
      };
      const inputList = [{ address }, { address }];

      const startLocation = `saddr=${location}`;
      const addressOne = Object.values(address).join();
      const addressOneEncoded = qs.escape(addressOne);
      const destinationOne = `daddr=${addressOneEncoded}`;
      const nearOne = `near=${addressOneEncoded}`;
      const addressTwo = Object.values(address).join();
      const addressTwoEncoded = qs.escape(addressTwo);
      const destinationTwo = `daddr=${addressTwoEncoded}`;
      const nearTwo = `near=${addressTwoEncoded}`;
      const encodedQueryOne = `${destinationOne}&${nearOne}&${startLocation}`;
      const encodedQueryTwo = `${destinationTwo}&${nearTwo}&${startLocation}`;
      const expectedMapLinkOne = `https://maps.google.com/maps?${encodedQueryOne}`;
      const expectedMapLinkTwo = `https://maps.google.com/maps?${encodedQueryTwo}`;

      const results = urlUtils.addMapUrl(location, inputList);

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
      }];

      const destination = 'line1,AB12 3CD';
      const encodedQuery = `daddr=${qs.escape(destination)}&near=${qs.escape(destination)}&saddr=${location}`;
      const expectedMapLink = `https://maps.google.com/maps?${encodedQuery}`;

      const results = urlUtils.addMapUrl(location, inputList);

      expect(results).to.be.an('array');
      expect(results.length).to.be.equal(1);
      expect(results[0].mapUrl).to.be.equal(expectedMapLink);
    });

    it('should use the user\'s input as the start address for location searches', () => {
      const inputList = [{
        address: {
          addressLines: ['line1'],
          postcode: 'AB12',
        },
      }];
      const destination = 'line1,AB12';
      const params = {
        daddr: destination,
        near: destination,
        saddr: `${location}`,
      };
      const expectedMapLink = `https://maps.google.com/maps?${qs.stringify(params)}`;

      const results = urlUtils.addMapUrl(location, inputList);

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
