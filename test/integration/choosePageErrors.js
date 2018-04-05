const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const chooseErrorRoute = `${constants.siteRoot}/location`;

function assertChooseErrorResponse(age, done, assertions) {
  chai.request(app)
    .get(chooseErrorRoute)
    .query({ age })
    .end((err, res) => {
      expect(err).to.equal(null);
      iExpect.htmlWith200Status(res);
      assertions(err, res);
      done();
    });
}

describe('Choose page with error', () => {
  const ageOver25 = constants.age.over25;
  const ageUnder25 = constants.age['16to24'];

  it('page error should be \'You must choose one of the options.\' if age question is answered 16-24', (done) => {
    assertChooseErrorResponse(ageUnder25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($('.error-summary').text()).to.contain('You must choose one of the options.');
    });
  });

  it('page title should be \'How do you want to get a test?\' if age question is answered 16-24', (done) => {
    assertChooseErrorResponse(ageUnder25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });
  });

  it('page options should be related to being under 25 (free), if age question is answered 16-24', (done) => {
    assertChooseErrorResponse(ageUnder25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($($('.multiple-choice .multiple--choice-option')[0]).text()).to.equal('Collect a free test kit near you');
    });
  });

  it('page errors should be \'You must choose one of the options.\' if errors and age is over 25', (done) => {
    assertChooseErrorResponse(ageOver25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($('.error-summary').text()).to.contain('You must choose one of the options.');
    });
  });

  it('page title should be \'How do you want to get a test?\' if errors and age is over 25', (done) => {
    assertChooseErrorResponse(ageOver25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });
  });

  it('page options should be related to being over 25 (paid), if errors and age is over 25', (done) => {
    assertChooseErrorResponse(ageUnder25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($($('.multiple-choice .multiple--choice-option')[0]).text()).to.equal('Collect a free test kit near you');
    });
  });
});
