const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const server = require('../../server');

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

    expect($('.local-header--title--question').text()).to.equal('We recommend:');
  });

  it('should not be indexed', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.yes });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);
    expect($('meta[name=robots]').attr('content')).to.equal('noindex');
  });

  it('page content should be related to having symptoms, if symptoms question is answered yes', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.yes });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($($('.nhsuk-o-grid p')[3]).text()).to.equal('This is because you have symptoms.');
  });

  it('page title should be \'We recommend that you\' if age question is answered 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: constants.age.under16 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.local-header--title--question').text()).to.equal('We recommend:');
  });

  it('page content should be related to being under 16, if age question is answered 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: constants.age.under16 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.nhsuk-o-grid p').eq(3).text()).to.equal('We\'re not able to offer test kits if you\'re under 16. You\'ll need to see a health professional to get tested.');
  });

  it('the page should have a link to the Location search page with the right params for symptoms', async () => {
    const res = await chai.request(server)
      .get(recommendRoute)
      .query({ symptoms: constants.symptoms.yes });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.button').attr('href'))
      .to.equal(`${locationSearchRoute}?type=${constants.serviceTypes.professional}`);
  });

  it('the page should have a link to the Location search page with the right params for age 15 or younger', async () => {
    const res = await chai.request(server)
      .get(chooseRoute)
      .query({ age: constants.age.under16 });

    iExpect.htmlWith200Status(res);
    const $ = cheerio.load(res.text);

    expect($('.button').attr('href'))
      .to.equal(`${locationSearchRoute}?type=${constants.serviceTypes.professional}`);
  });

  describe('return to Choices services', () => {
    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const res = await chai.request(server)
        .get(recommendRoute)
        .query({ symptoms: constants.symptoms.yes });

      iExpect.htmlWith200Status(res);
      const $ = cheerio.load(res.text);

      expect($($('.nhsuk-c-breadcrumb__item a')[1]).attr('href'))
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
