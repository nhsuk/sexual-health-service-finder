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
    let $;

    before('run request', async () => {
      const res = await chai.request(server)
        .get(chooseRoute)
        .query({ age: constants.age['16to24'] });
      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('should not be indexed', async () => {
      expect($('meta[name=robots]').attr('content')).to.equal('noindex');
    });

    it('page title should be \'How do you want to get a test?\' if age question is answered 16-24', async () => {
      expect($('.local-header--title--question').text()).to.contain('How do you want to get a test?');
    });

    it('page options should be related to being under 25 (free), if age question is answered 16-24', async () => {
      expect($('.nhsuk-label').eq(0).text()).to.contain('Collect a free test kit near you');
    });
  });

  describe('for over 25s', () => {
    let $;

    before('run request', async () => {
      const res = await chai.request(server)
        .get(chooseRoute)
        .query({ age: constants.age.over25 });
      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('page title should be \'How do you want to get a test?\' if age question is answered 25 or older', async () => {
      expect($('.local-header--title--question').text()).to.contain('How do you want to get a test?');
    });

    it('page options should be related to being over 25 (paid), if age question is answered 25 or older', async () => {
      expect($('.nhsuk-label').eq(0).text()).to.contain('See a sexual health professional near you');
    });
  });
});
