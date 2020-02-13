const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Start page', () => {
  let $;

  before('make request', async () => {
    const res = await chai.request(server).get(`${constants.siteRoot}`);

    $ = cheerio.load(res.text);
  });

  it('page title should be \'Find a chlamydia test - NHS\'', async () => {
    expect($('head title').text()).to.equal('Find a chlamydia test - NHS');
    expect($('.local-header--title--question').text()).to.equal('Find a chlamydia test');
  });

  it('should be indexed', async () => {
    expect($('meta[name=robots]').attr('content')).to.equal(undefined);
  });

  it('should link to the \'Symptoms\' page', async () => {
    const symptomsPage = `${constants.siteRoot}/symptoms`;

    expect($('.nhsuk-button').attr('href'))
      .to.equal(symptomsPage);
  });
});
