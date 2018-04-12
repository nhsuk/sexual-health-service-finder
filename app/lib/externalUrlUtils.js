const qs = require('querystring');

function joinAllTruthyValues(obj) {
  return Object.values(obj)
    .filter(value => value)
    .join();
}

function filterNotFoundNames(name, addressLines) {
  const matches = name.match(/@/);
  if (matches) {
    // eslint-disable-next-line no-param-reassign
    name = name.substring(0, matches.index - 1);
  }
  return `${name},${addressLines}`;
}

function addMapUrl(postcodeLocationDetails, inputList) {
  return inputList.map((item) => {
    const addressLines = `${joinAllTruthyValues(item.address.addressLines)},${item.address.postcode}`;
    const saddr = `${postcodeLocationDetails.location.lat},${postcodeLocationDetails.location.lon}`;
    const fullNameAndAddress = filterNotFoundNames(item.name, addressLines);

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

function getChoicesResultsUrlToOnlineTests(postcodeLocationDetails, location) {
  if (location && postcodeLocationDetails && postcodeLocationDetails.location) {
    return `https://www.nhs.uk/service-search/Chlamydia-free-online-tests-for-u-25s/${location}/Results/105/${postcodeLocationDetails.location.lon}/${postcodeLocationDetails.location.lat}/344/0?distance=25`;
  }
  return undefined;
}

module.exports = {
  addMapUrl,
  getChoicesResultsUrlToOnlineTests,
};
