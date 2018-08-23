const chai = require('chai');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');

const iExpect = require('../lib/expectations');
const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('redirection', () => {
  it('should redirect root requests to /find-a-chlamydia-test/', async () => {
    const res = await chai.request(server).get('/');
    iExpect.htmlWith200Status(res);
    expect(res).to.redirect;
    expect(res.req.path).to.equal(`${constants.siteRoot}/`);
  });
});

describe('An unknown page', () => {
  it('should return a 404', async () => {
    try {
      await chai.request(server).get(`${constants.siteRoot}/not-known`);
    } catch (err) {
      expect(err).to.have.status(404);
      expect(err.response).to.be.html;
    }
  });
});

describe('meta tags', () => {
  it('should instruct Webtrends to anonymise IP Addresses', async () => {
    const res = await chai.request(server).get('/');
    const $ = cheerio.load(res.text);

    expect($('meta[name="DCS.dcsipa"]').prop('content')).to.equal('1');
  });
});
