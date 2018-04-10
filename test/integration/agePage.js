const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const recommendRoute = `${constants.siteRoot}/recommend`;
const ageRoute = `${constants.siteRoot}/age`;
const chooseRoute = `${constants.siteRoot}/choose`;

function expectAgePageAgain($) {
  expect($('.error-summary-heading').text())
    .to.contain('You must choose one of the options.');
  expect($('.local-header--title--question').text()).to.equal('How old are you?');
}

describe('Age page', () => {
  it('page title should be \'How old are you?\' if symptoms question is answered no', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.no });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('How old are you?');
  });

  it('should not be indexed', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.no });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('meta[name=robots]').attr('content')).to.equal('noindex');
  });

  it('should return age page with an error message if age question is not answered', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: '' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectAgePageAgain($);
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(ageRoute);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const res = await chai.request(server).get(ageRoute);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
