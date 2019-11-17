const chai = require('chai');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const nockRequests = require('../lib/nockRequests');
const messages = require('../../app/lib/displayUtils/messages');

const expect = chai.expect;

const results = `${constants.siteRoot}/results`;
function notFoundPostcodeMessage(location) {
  return `We can't find the postcode '${location}'. Please check the postcode is correct and try again.\nOr get help to find a chlamydia test in find a chlamydia test in Scotland, find a chlamydia test in Wales or find a chlamydia test in Northern Ireland.`;
}

function expectErrorMessage(res, message) {
  const $ = cheerio.load(res.text);
  const error = getTextOnlyFromElement($('.nhsuk-error-message'));

  expect(error).to.equal(message);
}

describe('Results page errors', () => {
  it('should return a descriptive message when location is blank', async () => {
    const location = '';
    const message = messages.emptyPostcodeMessage();

    const res = await chai.request(app)
      .get(results)
      .query({
        location,
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      });

    expectErrorMessage(res, message);
  });

  it('should return a descriptive message when the postcode is invalid', async () => {
    const location = 'LS1234';

    nockRequests.postcodeSearch(location, 200, 'no-postcodes-found-response.json');

    const res = await chai.request(app)
      .get(results)
      .query({
        location,
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      });

    expectErrorMessage(res, notFoundPostcodeMessage(location));
  });

  it('should return a descriptive message when no postcodes can be found', async () => {
    const location = 'no postcodes';

    nockRequests.postcodeSearch(location, 200, 'no-postcodes-found-response.json');

    const res = await chai.request(app)
      .get(results)
      .query({
        location,
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      });

    expectErrorMessage(res, notFoundPostcodeMessage(location));
  });
});
