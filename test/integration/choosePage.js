const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const chooseRoute = `${constants.siteRoot}/choose`;

function assertChooseResponse(age, done, assertions) {
  chai.request(app)
    .get(chooseRoute)
    .query({ age })
    .end((err, res) => {
      expect(err).to.equal(null);
      iExpect.htmlWith200Status(res);
      assertions(err, res);
      done();
    });
}

describe('Choose page', () => {
  const ageOver25 = constants.age.over25;
  const ageUnder25 = constants.age['16to24'];

  it('page title should be \'How do you want to get a test?\' if age question is answered 16-24', (done) => {
    assertChooseResponse(ageUnder25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });
  });

  it('page options should be related to being under 25 (free), if age question is answered 16-24', (done) => {
    assertChooseResponse(ageUnder25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($($('.multiple-choice .multiple--choice-option')[0]).text()).to.equal('Collect a free test kit near you');
    });
  });

  it('page title should be \'How do you want to get a test?\' if age question is answered 25 or older', (done) => {
    assertChooseResponse(ageOver25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });
  });

  it('page options should be related to being over 25 (paid), if age question is answered 25 or older', (done) => {
    assertChooseResponse(ageOver25, done, (err, res) => {
      const $ = cheerio.load(res.text);
      expect($($('.multiple-choice .multiple--choice-option')[0]).text()).to.equal('See a sexual health professional for free near you');
    });
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', (done) => {
      assertChooseResponse({}, done, (err, res) => {
        const $ = cheerio.load(res.text);
        expect($($('div.breadcrumb a')[1]).attr('href'))
          .to.equal('https://www.nhs.uk/service-search');
      });
    });

    it('the page should have a link back to the Choices service search', (done) => {
      assertChooseResponse({}, done, (err, res) => {
        const $ = cheerio.load(res.text);
        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search');
      });
    });
  });
});
