require('object.values').shim();
const qs = require('querystring');

function joinAllTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join();
}

function addUrl(postcodeLocationDetails, inputList) {
  return inputList.map((item) => {
    const address = joinAllTruthyValues(item.address);
    const saddr = `${postcodeLocationDetails.location.lat},${postcodeLocationDetails.location.lon}`;
    let fullNameAndAddress;

    if (item.name.includes('@')) {
      fullNameAndAddress = address;
    } else {
      fullNameAndAddress = `${item.name},${address}`;
    }

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
