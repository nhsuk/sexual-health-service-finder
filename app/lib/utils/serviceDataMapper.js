function addressFormatter(address) {
  if ((address) && (address.addressLines) && (address.postcode)) {
    return `${address.addressLines.join(', ')}, ${address.postcode}`;
  }
  return undefined;
}

module.exports = {
  addressFormatter,
};
