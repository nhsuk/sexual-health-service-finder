const qs = require('querystring');

function joinAllTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join();
}

function filterNotFoundNames(name, address) {
  if (name.includes('@')) {
    return address;
  }
  return `${name},${address}`;
}

function addUrl(postcodeLocationDetails, inputList) {
  return inputList.map((item) => {
    const address = joinAllTruthyValues(item.address);
    const saddr = `${postcodeLocationDetails.location.lat},${postcodeLocationDetails.location.lon}`;
    const fullNameAndAddress = filterNotFoundNames(item.name, address);

    const params = {
      daddr: fullNameAndAddress,
      near: fullNameAndAddress,
      saddr,
    };

    // eslint-disable-next-line no-param-reassign
    item.mapUrl = `https://maps.google.com/maps?${qs.stringify(params)}`;
    return item;
  });
}

module.exports = {
  addUrl,
};
