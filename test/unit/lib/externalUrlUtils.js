const qs = require('querystring');
const chai = require('chai');

const urlUtils = require('../../../app/lib/externalUrlUtils');

const expect = chai.expect;

describe('externalUrlUtils', () => {
  describe('addMapUrl', () => {
    const location = 'location';

    it('should set \'saddr\' as first param and use the full address from the item for \'daddr\' and \'near\'', () => {
      const fullAddress = 'line1, AB12';
      const inputList = [{ address: fullAddress }];
      const params = {
        daddr: fullAddress,
        near: fullAddress,
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
