const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const recommendRoute = `${constants.siteRoot}/recommend`;
const chooseRoute = `${constants.siteRoot}/choose`;
const locationSearchRoute = `${constants.siteRoot}/location`;

describe('Recommend page', () => {
  it('step count should be \'Step 3 of 4\'', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.yes });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.local-header--step').text()).to.equal('Step 3 of 4');
  });

  it('page title should be \'We recommend that you\' if symptoms question is answered yes', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.yes });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.local-header--title--question').text()).to.equal('We recommend that you');
  });

  it('page content should be related to having symptoms, if symptoms question is answered yes', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: 'yes' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($($('.page-section p')[3]).text()).to.equal('This is because you have symptoms.');
  });

  it('page title should be \'We recommend that you\' if age question is answered 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: constants.age.under16 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.local-header--title--question').text()).to.equal('We recommend that you');
  });

  it('page content should be related to being under 16, if age question is answered 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: '1' });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($($('.page-section p')[3]).text()).to.equal('This is because you’re under the legal age of consent for sex.');
  });

  it('the page should have a link to the Location search page with the right params for symptoms', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.yes });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.button').attr('href'))
      .to.equal(`${locationSearchRoute}?type=${constants.serviceTypes.professional}&origin=${constants.serviceChoices.symptoms}`);
  });

  it('the page should have a link to the Location search page with the right params for age 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: constants.age.under16 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.button').attr('href'))
      .to.equal(`${locationSearchRoute}?type=${constants.serviceTypes.professional}&origin=${constants.serviceChoices.under16}`);
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server)
        .get(recommendRoute)
        .query({ symptoms: constants.symptoms.yes });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expect($($('div.breadcrumb a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const res = await chai.request(server)
        .get(recommendRoute)
        .query({ symptoms: constants.symptoms.yes });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
