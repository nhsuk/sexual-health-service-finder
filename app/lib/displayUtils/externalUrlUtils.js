const qs = require('querystring');

function addMapUrl(saddr, inputList) {
  return inputList.map((item) => {
    const params = {
      daddr: item.address,
      near: item.address,
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
