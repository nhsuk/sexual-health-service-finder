const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const server = require('../../server');
const iExpect = require('../lib/expectations');

const expect = chai.expect;

chai.use(chaiHttp);

const chooseRoute = `${constants.siteRoot}/choose`;

describe('Choose page', () => {
  describe('for 16 to 24', () => {
    let res;
    before('run request', async () => {
      res = await chai.request(server)
        .get(chooseRoute)
        .query({ age: constants.age['16to24'] });
      iExpect.htmlWith200Status(res);
    });

    it('step count should be \'Step 3 of 4\'', async () => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--step').text()).to.equal('Step 3 of 4');
    });

    it('should not be indexed', async () => {
      const $ = cheerio.load(res.text);
      expect($('meta[name=robots]').attr('content')).to.equal('noindex');
    });

    it('page title should be \'How do you want to get a test?\' if age question is answered 16-24', async () => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });

    it('page options should be related to being under 25 (free), if age question is answered 16-24', async () => {
      const $ = cheerio.load(res.text);

      expect($('.multiple-choice .multiple--choice-option').eq(0).text()).to.equal('Collect a free test kit near you');
    });
  });

  describe('for over 25s', () => {
    let res;
    before('run request', async () => {
      res = await chai.request(server)
        .get(chooseRoute)
        .query({ age: constants.age.over25 });
      iExpect.htmlWith200Status(res);
    });

    it('step count should be \'Step 3 of 4\'', async () => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--step').text()).to.equal('Step 3 of 4');
    });

    it('page title should be \'How do you want to get a test?\' if age question is answered 25 or older', async () => {
      const $ = cheerio.load(res.text);
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });

    it('page options should be related to being over 25 (paid), if age question is answered 25 or older', async () => {
      const $ = cheerio.load(res.text);

      expect($('.multiple-choice .multiple--choice-option').eq(0).text()).to.equal('See a sexual health professional near you');
    });
  });

  describe('return to Choices services', () => {
    let res;
    before('run request', async () => {
      res = await chai.request(server).get(chooseRoute);
    });

    it('the breadcrumb should have a link back to the Choices \'Services near you\'', async () => {
      const $ = cheerio.load(res.text);

      expect($($('.nhsuk-c-breadcrumb__item a')[1]).attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });

    it('the page should have a link back to the Choices service search', async () => {
      const $ = cheerio.load(res.text);

      expect($('.back-to-choices').attr('href'))
        .to.equal('https://www.nhs.uk/service-search');
    });
  });
});
