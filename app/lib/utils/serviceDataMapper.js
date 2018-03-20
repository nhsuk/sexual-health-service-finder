function addressFormatter(addressLines, postcode) {
  return `${addressLines}, ${postcode}`;
}

module.exports = {
  addressFormatter,
};
