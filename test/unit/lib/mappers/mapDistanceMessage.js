const chai = require('chai');
const mapDistanceMessage = require('../../../../app/lib/mappers/mapDistanceMessage');

const expect = chai.expect;

describe('mapDistanceMessage', () => {
  const validOrigin = {
    location: {
      lat: -3.1,
      lon: 45.8,
    },
  };
  const validDestination = {
    Geocode: {
      coordinates: [54.1, -1.2],
    },
  };

  describe('scenarios returning a message', () => {
    it('should return a message for the distance between the origin and destination rounded to 1 dp', () => {
      const distanceMessage = mapDistanceMessage(validOrigin, validDestination);

      expect(distanceMessage).to.be.a('string');
      expect(distanceMessage).to.equal('588.1 miles away');
    });

    it('should return a message with no dp when not required', () => {
      const destSameAsOrigin = {
        Geocode: { coordinates: [validOrigin.location.lon, validOrigin.location.lat] },
      };
      const distanceMessage = mapDistanceMessage(validOrigin, destSameAsOrigin);

      expect(distanceMessage).to.be.a('string');
      expect(distanceMessage).to.equal('0 miles away');
    });
  });

  describe('scenarios when undefined should be returned', () => {
    it('should return undefined when origin does not have a location', () => {
      const originWithNoLocation = {};

      const distanceMessage = mapDistanceMessage(originWithNoLocation, validDestination);

      expect(distanceMessage).to.be.undefined;
    });

    it('should return undefined when origin does not contain location.lat', () => {
      const originWithNoLat = { location: { lon: 1 } };

      const distanceMessage = mapDistanceMessage(originWithNoLat, validDestination);

      expect(distanceMessage).to.be.undefined;
    });

    it('should return undefined when origin does not contain location.lon', () => {
      const originWithNoLon = { location: { lat: 1 } };

      const distanceMessage = mapDistanceMessage(originWithNoLon, validDestination);

      expect(distanceMessage).to.be.undefined;
    });

    it('should return undefined when destination does not contain Geocode', () => {
      const destinationWithNoGeocode = {};

      const distanceMessage = mapDistanceMessage(validOrigin, destinationWithNoGeocode);

      expect(distanceMessage).to.be.undefined;
    });

    it('should return undefined when destination does not contain coordinates', () => {
      const destinationWithNoCoordinates = { Geocode: {} };

      const distanceMessage = mapDistanceMessage(validOrigin, destinationWithNoCoordinates);

      expect(distanceMessage).to.be.undefined;
    });

    it('should return undefined when destination does not contain a pair of coordinates', () => {
      const destinationWithOneCoordinate = { Geocode: { coordinates: [1] } };

      const distanceMessage = mapDistanceMessage(validOrigin, destinationWithOneCoordinate);

      expect(distanceMessage).to.be.undefined;
    });
  });
});
