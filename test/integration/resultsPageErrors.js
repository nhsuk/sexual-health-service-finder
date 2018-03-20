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

function makeSearchRequestAndCheckExpectations(postcode, assertions) {
  chai.request(app)
    .get(results)
    .query({
      location: postcode,
      origin: constants.serviceChoices.symptoms,
      type: constants.serviceTypes.professional,
    })
    .end(assertions);
}

describe('Results page', () => {
  it('should return a descriptive message when postcode is blank', (done) => {
    const postcode = '';
    const message = messages.emptyPostcodeMessage();

    makeSearchRequestAndCheckExpectations(postcode, (err, res) => {
      expectErrorMessage(res, message);
      done();
    });
  });

  it('should return a descriptive message when postcode is invalid', (done) => {
    const postcode = 'LS1 234';
    const message = messages.invalidPostcodeMessage(postcode);

    makeSearchRequestAndCheckExpectations(postcode, (err, res) => {
      expectErrorMessage(res, message);
      done();
    });
  });

  it('should return a descriptive message for out of England postcodes', (done) => {
    const postcode = 'EH1';
    const message = messages.outsideOfEnglandPostcodeMessage();

    makeSearchRequestAndCheckExpectations(postcode, (err, res) => {
      expectErrorMessage(res, message);
      done();
    });
  });
});
