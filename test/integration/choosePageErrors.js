const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const iExpect = require('../lib/expectations');
const mandatorySelectionMessage = require('../../app/lib/displayUtils/messages').mandatorySelectionMessage;
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

const chooseErrorRoute = `${constants.siteRoot}/location`;

describe('Choose page with error', () => {
  describe('for 16 to 24', () => {
    let $;

    before('run request', async () => {
      const res = await chai.request(server)
        .get(chooseErrorRoute)
        .query({ origin: constants.serviceChoices['16to24'] });
      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('page errors should be \'You must choose one of the options.\' if errors and age is 16-24', async () => {
      expect($('.error-summary').text()).to.contain(mandatorySelectionMessage());
    });

    it('page title should be \'How do you want to get a test?\' if errors and age is 16-24', async () => {
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });

    it('page options should be related to being under 25 (free), if errors and age is 16-24', async () => {
      expect($('.multiple-choice .multiple--choice-option').first().text()).to.equal('Collect a free test kit near you');
    });
  });

  describe('for over 25s', () => {
    let $;

    before('run request', async () => {
      const res = await chai.request(server)
        .get(chooseErrorRoute)
        .query({ origin: constants.serviceChoices.over25 });
      iExpect.htmlWith200Status(res);
      $ = cheerio.load(res.text);
    });

    it('page errors should be \'You must choose one of the options.\' if errors and age is over 25', async () => {
      expect($('.error-summary').text()).to.contain(mandatorySelectionMessage());
    });

    it('page title should be \'How do you want to get a test?\' if errors and age is over 25', async () => {
      expect($('.local-header--title--question').text()).to.equal('How do you want to get a test?');
    });

    it('page options should be related to being over 25 (paid), if errors and age is over 25', async () => {
      expect($('.multiple-choice .multiple--choice-option').first().text()).to.equal('See a sexual health professional near you');
    });
  });
});
