const joinTruthyValues = require('./utils').joinTruthyValues;

function formatAddress(address) {
  if (!address || Object.keys(address).length === 0) { return undefined; }

  const addressLines = address.addressLines || [];
  if (address.postcode) {
    addressLines.push(address.postcode);
  }
  return joinTruthyValues(addressLines);
}

module.exports = formatAddress;
