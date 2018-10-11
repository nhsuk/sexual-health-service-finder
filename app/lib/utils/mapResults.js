// const formatAddress = require('./formatAddress');
const formatOpeningTimes = require('./formatOpeningTimes');

function mapResults(results) {
    console.log('############################');
    console.log(Object.keys(results));
  return results && results.value ? results.value.map((result) => {
    // eslint-disable-next-line no-underscore-dangle
    // console.log(result);
    const service = result;
    if (service) {
      // if (result.sort) { service.distance = result.sort[0]; }

      const address = service.Address1;
      if (address) { address.fullAddress = address; }

      const openingTimes = service.openingTimes;
      // if (openingTimes) {
      //   openingTimes.formatted = formatOpeningTimes(openingTimes);
      // }
    }
    return service;
  }) : [];
}

module.exports = mapResults;
