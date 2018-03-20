const chai = require('chai');
const chaiHttp = require('chai-http');

const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('redirection', () => {
  it('should redirect root requests to /find-a-chlamydia-test/', async () => {
    const res = await chai.request(server).get('/');
    expect(res).to.have.status(200);
    expect(res).to.be.html;
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
