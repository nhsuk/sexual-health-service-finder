const calculateDistance = require('../displayUtils/calculateDistance');

function mapDistanceMessage(origin, destination) {
  if (!origin || !origin.location || !origin.location.lat || !origin.location.lon
    || !destination || !destination.Geocode || !destination.Geocode.coordinates
    || !destination.Geocode.coordinates[0] || !destination.Geocode.coordinates[1]) {
    return undefined;
  }

  const originCoords = {
    lat: origin.location.lat,
    lon: origin.location.lon,
  };
  const destinationCoords = {
    lat: destination.Geocode.coordinates[1],
    lon: destination.Geocode.coordinates[0],
  };

  const distance = calculateDistance(originCoords, destinationCoords).toFixed(1);
  const intPart = Math.floor(distance);
  const decimalPart = distance - intPart;

  const distanceToDisplay = decimalPart ? distance : intPart;
  return `${distanceToDisplay} miles away`;
}

module.exports = mapDistanceMessage;
