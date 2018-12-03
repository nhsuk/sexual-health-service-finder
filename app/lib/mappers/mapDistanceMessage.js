const calculateDistance = require('../displayUtils/calculateDistance');

function isOriginValid(origin) {
  return origin && origin.location && origin.location.lat && origin.location.lon;
}

function isDestinationValid(destination) {
  return destination && destination.Geocode && destination.Geocode.coordinates
      && destination.Geocode.coordinates[0] && destination.Geocode.coordinates[1];
}

function getOriginCoords(origin) {
  return {
    lat: origin.location.lat,
    lon: origin.location.lon,
  };
}

function getDestinationCoords(destination) {
  return {
    lat: destination.Geocode.coordinates[1],
    lon: destination.Geocode.coordinates[0],
  };
}

function getDistanceMessage(originCoords, destinationCoords) {
  const distance = calculateDistance(originCoords, destinationCoords).toFixed(1);
  const intPart = Math.floor(distance);
  const decimalPart = distance - intPart;

  const distanceToDisplay = decimalPart ? distance : intPart;
  return `${distanceToDisplay} miles away`;
}

function mapDistanceMessage(origin, destination) {
  if (!isOriginValid(origin) || !isDestinationValid(destination)) {
    return undefined;
  }

  const originCoords = getOriginCoords(origin);
  const destinationCoords = getDestinationCoords(destination);

  return getDistanceMessage(originCoords, destinationCoords);
}

module.exports = mapDistanceMessage;
