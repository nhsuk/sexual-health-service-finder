const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

async function assertMapping(args, expectedMessage) {
  const res = await chai.request(server)
    .get(`${constants.SITE_ROOT}/location`)
    .query(args);

  const $ = cheerio.load(res.text);

  expect($('title').text()).to.equal('Find a chlamydia test - NHS.UK');
  expect($('.local-header--title--question').text()).to.equal(expectedMessage);
}

describe('Location page', () => {
  describe('accessed via journey', () => {
    it('should ask for location of sexual health professionals for under 16 year olds', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES.under16, type: constants.SERVICE_TYPES.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of sexual health professionals for people with symptoms', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES.symptoms, type: constants.SERVICE_TYPES.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of sexual health professionals for people between 16 and 25', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES['16to25'], type: constants.SERVICE_TYPES.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of sexual health professionals for people over 25', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES.over25, type: constants.SERVICE_TYPES.professional },
        'Where would you like to see a sexual health professional?'
      );
    });

    it('should ask for location of free kits for people between 16 and 25', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES['16to25'], type: constants.SERVICE_TYPES.kit },
        'Where would you like to collect your free test kit?'
      );
    });

    it('should ask for location of paid kits for people over 25', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES.over25, type: constants.SERVICE_TYPES.kit },
        'Where would you like to collect your test kit?'
      );
    });
  });

  describe('accessed via url', () => {
    it('should return an error page if there are no parameters', async () => {
      assertMapping(
        {},
        'Sorry, we are experiencing technical problems.'
      );
    });

    it('should return an error page if there are parameters missing', async () => {
      assertMapping(
        { type: constants.SERVICE_TYPES.kit },
        'Sorry, we are experiencing technical problems.'
      );
    });

    it('should return an error page for a combination of kits and under 16 parameters', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES.under16, type: constants.SERVICE_TYPES.kit },
        'Sorry, we are experiencing technical problems.'
      );
    });

    it('should return an error page for a combination of kits and symptoms parameters', async () => {
      assertMapping(
        { origin: constants.SERVICE_CHOICES.symptoms, type: constants.SERVICE_TYPES.kit },
        'Sorry, we are experiencing technical problems.'
      );
    });
  });
});
