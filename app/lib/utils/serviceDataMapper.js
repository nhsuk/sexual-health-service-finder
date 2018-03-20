function addressFormatter(addressLines, postcode) {
  return `${addressLines.join(', ')}, ${postcode}`;
}

module.exports = {
  addressFormatter,
};
