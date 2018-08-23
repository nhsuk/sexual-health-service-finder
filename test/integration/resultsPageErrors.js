const chai = require('chai');
const cheerio = require('cheerio');

const app = require('../../server');
const constants = require('../../app/lib/constants');
const messages = require('../../app/lib/messages');

const expect = chai.expect;

const results = `${constants.siteRoot}/results`;

function expectErrorMessage(res, message) {
  const $ = cheerio.load(res.text);
  const error = $('.error-summary-heading').text();

  expect(error).to.contain(message);
}

function makeSearchRequestAndCheckExpectations(location, assertions) {
  chai.request(app)
    .get(results)
    .query({
      location,
      origin: constants.serviceChoices.symptoms,
      type: constants.serviceTypes.professional,
    })
    .end(assertions);
}

describe('Results page errors', () => {
  it('should return a descriptive message when location is blank', (done) => {
    const location = '';
    const message = messages.emptyPostcodeMessage();

    makeSearchRequestAndCheckExpectations(location, (err, res) => {
      expectErrorMessage(res, message);
      done();
    });
  });

  it('should return a descriptive message when location is invalid', (done) => {
    const location = 'LS1 234';
    const message = messages.invalidPostcodeMessage(location);

    makeSearchRequestAndCheckExpectations(location, (err, res) => {
      expectErrorMessage(res, message);
      done();
    });
  });

  it('should return a descriptive message for out of England locations', (done) => {
    const location = 'EH1';
    const message = 'This postcode is not in England. Get help to find a chlamydia test in find a chlamydia test in '
      + 'Scotland, find a chlamydia test in Wales or find a chlamydia test in Northern Ireland.';

    makeSearchRequestAndCheckExpectations(location, (err, res) => {
      expectErrorMessage(res, message);
      done();
    });
  });
});
