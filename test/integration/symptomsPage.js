const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const mandatorySelectionMessage = require('../../app/lib/displayUtils/messages').mandatorySelectionMessage;
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const symptomsRoute = `${constants.siteRoot}/symptoms`;
const recommendRoute = `${constants.siteRoot}/recommend`;

function expectSymptomsPageAgain($) {
  expect($('.error-summary-heading').text()).to.contain(mandatorySelectionMessage());
  expect($('.local-header--title--question').text()).to.equal('Do you have any of these symptoms?');
}

describe('Symptoms page', () => {
  describe('happy path', () => {
    let $;

    before('make request', async () => {
      const res = await chai.request(server).get(symptomsRoute);
      $ = cheerio.load(res.text);
    });

    it('step count should be \'Step 1 of 4\'', async () => {
      expect($('.local-header--step').text()).to.equal('Step 1 of 4');
    });

    it('page title should be \'Do you have any of the following symptoms?\'', async () => {
      expect($('head title').text()).to.equal('Find a chlamydia test - NHS');
      expect($('.local-header--title--question').text()).to.equal('Do you have any of these symptoms?');
    });

    it('should not be indexed', async () => {
      expect($('meta[name=robots]').attr('content')).to.equal('noindex');
    });
    describe('return to Choices services', () => {
      it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
        expect($($('.nhsuk-c-breadcrumb__item a')[1]).attr('href'))
          .to.equal('https://www.nhs.uk/service-search');
      });

      it('the page should have a link back to the Choices service search', async () => {
        expect($('.back-to-choices').attr('href'))
          .to.equal('https://www.nhs.uk/service-search');
      });
    });
  });

  describe('error path', () => {
    it('should return symptoms page with an error message if symptoms question is not answered', async () => {
      const res = await chai.request(server)
        .get(recommendRoute)
        .query({ symptoms: '' });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);
      expectSymptomsPageAgain($);
    });
  });
});
