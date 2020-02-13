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
  describe('with symptoms', () => {
    let $;

    before('make request', async () => {
      const res = await chai.request(server)
        .get(recommendRoute)
        .query({ symptoms: constants.symptoms.yes });
      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('page title should be \'We recommend that you\' if symptoms question is answered yes', () => {
      expect($('.local-header--title--question').text()).to.equal('We recommend:');
    });

    it('should not be indexed', () => {
      expect($('meta[name=robots]').attr('content')).to.equal('noindex');
    });

    it('page content should be related to having symptoms, if symptoms question is answered yes', () => {
      expect($($('main p')[0]).text()).to.equal('This is because you have symptoms.');
    });

    it('the page should have a link to the Location search page with the right params for symptoms', async () => {
      expect($('.nhsuk-button').attr('href'))
        .to.equal(`${locationSearchRoute}?type=${constants.serviceTypes.professional}`);
    });
  });

  describe('under 16', () => {
    let $;

    before('make request', async () => {
      const res = await chai.request(server)
        .get(chooseRoute)
        .query({ age: constants.age.under16 });

      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('page title should be \'We recommend that you\' if age question is answered 15 or younger', () => {
      expect($('.local-header--title--question').text()).to.equal('We recommend:');
    });

    it('page content should be related to being under 16, if age question is answered 15 or younger', () => {
      expect($($('main p')[0]).text()).to.equal('We\'re not able to offer test kits if you\'re under 16. You\'ll need to see a health professional to get tested.');
    });

    it('the page should have a link to the Location search page with the right params for age 15 or younger', () => {
      expect($('.nhsuk-button').attr('href'))
        .to.equal(`${locationSearchRoute}?type=${constants.serviceTypes.professional}`);
    });
  });
});
