const chai = require('chai');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const getTextOnlyFromElement = require('../lib/utils').getTextOnlyFromElement;
const nockRequests = require('../lib/nockRequests');
const messages = require('../../app/lib/displayUtils/messages');

const expect = chai.expect;

const results = `${constants.siteRoot}/results`;

function expectErrorMessage(res, message) {
  const $ = cheerio.load(res.text);
  const error = getTextOnlyFromElement($('.error-summary-heading'));

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

  it('should return a descriptive message when location is invalid', async () => {
    const location = 'LS1234';
    const message = messages.invalidPostcodeMessage(location);

    nockRequests.postcodesIO(`/postcodes/${location}`, 404, 'postcodesio-404.json');

    const res = await chai.request(app)
      .get(results)
      .query({
        location,
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      });

    expectErrorMessage(res, message);
  });

  it('should return a descriptive message for out of England locations', async () => {
    const location = 'EH1';
    const message = 'This postcode is not in England. Get help to find a chlamydia test in find a chlamydia test in '
      + 'Scotland, find a chlamydia test in Wales or find a chlamydia test in Northern Ireland.';

    nockRequests.postcodesIO(`/outcodes/${location}`, 200, 'outcodeResponse_EH1.json');

    const res = await chai.request(app)
      .get(results)
      .query({
        location,
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      });

    expectErrorMessage(res, message);
  });
});
