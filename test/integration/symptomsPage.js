const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const symptomsRoute = `${constants.siteRoot}/symptoms`;
const recommendRoute = `${constants.siteRoot}/recommend`;

function expectSymptomsPageAgain($) {
  expect($('.error-summary-heading').text())
    .to.contain('You must choose one of the options.');
  expect($('.local-header--title--question').text()).to.equal('Do you have any of the following symptoms?');
}

describe('Symptoms page', () => {
  it('step count should be \'Step 1 of 4\'', async () => {
    const res = await chai.request(server).get(symptomsRoute);
    const $ = cheerio.load(res.text);

    expect($('.local-header--step').text()).to.equal('Step 1 of 4');
  });

  it('page title should be \'Do you have any of the following symptoms?\'', async () => {
    const res = await chai.request(server).get(symptomsRoute);

    const $ = cheerio.load(res.text);

    expect($('title').text()).to.equal('Find a chlamydia test - NHS.UK');
    expect($('.local-header--title--question').text()).to.equal('Do you have any of the following symptoms?');
  });

  it('should return symptoms page with an error message if symptoms question is not answered', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: '' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expectSymptomsPageAgain($);
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server).get(symptomsRoute);

      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const res = await chai.request(server).get(symptomsRoute);

      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
