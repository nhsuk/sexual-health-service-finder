const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const recommendRoute = `${constants.SITE_ROOT}/recommend`;
const ageRoute = `${constants.SITE_ROOT}/age`;
const chooseRoute = `${constants.SITE_ROOT}/choose`;

function expectAgePageAgain($) {
  expect($('.error-summary-heading').text())
    .to.contain('You must choose one of the options.');
  expect($('.local-header--title--question').text()).to.equal('How old are you?');
}

describe('Age page', () => {
  it('page title should be \'How old are you?\' if symptoms question is answered no', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: 'no' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('.local-header--title--question').text()).to.equal('How old are you?');
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
        .to.equal('https://www.nhs.uk/Service-Search');
    });
  });
});
