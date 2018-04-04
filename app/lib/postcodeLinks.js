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

function addMapUrl(postcodeLocationDetails, inputList) {
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

function addExternalUrl(postcodeLocationDetails, location) {
  if (location && postcodeLocationDetails && postcodeLocationDetails.location) {
    return `https://www.nhs.uk/service-search/Chlamydia-free-online-tests-for-u-25s/${location}/Results/105/${postcodeLocationDetails.location.lon}/${postcodeLocationDetails.location.lat}/344/0?distance=25`;
  }
  return false;
}

module.exports = {
  addExternalUrl,
  addMapUrl,
};
