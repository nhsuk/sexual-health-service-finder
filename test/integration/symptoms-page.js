const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const symptomsRoute = `${constants.SITE_ROOT}/symptoms`;

function expectSearchAgainPage($) {
  expect($('.error-summary-heading').text())
    .to.contain('You must choose one of the options');
}

describe('Symptoms page', () => {
  describe('page header', () => {
    it('should be \'Do you have any of the following symptoms?\'', async () => {
      const res = await chai.request(server).get(symptomsRoute);

      const $ = cheerio.load(res.text);

      expect($('title').text()).to.equal('Find a chlamydia test - NHS.UK');
      expect($('.local-header--title--question').text()).to.equal('Do you have any of the following symptoms?');
    });
  });

  describe('form validation', () => {
    it('should return symptoms page when no answer is selected', async () => {
      const res = await chai.request(server)
        .get(symptomsRoute)
        .query({ symptoms: '' });

      const $ = cheerio.load(res.text);

      expectSearchAgainPage($);
      expect($('.local-header--title--question').text()).to.equal('Do you have any of the following symptoms?');
    });
  });

  describe('return to Choices services', () => {
    it('should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(symptomsRoute);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('should have a link back to the Choices service search', async () => {
      const res = await chai.request(server).get(symptomsRoute);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/Service-Search');
    });
  });
});
