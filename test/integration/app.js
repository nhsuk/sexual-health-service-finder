const chai = require('chai');
const chaiHttp = require('chai-http');

const constants = require('../../app/lib/constants');
const server = require('../../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('redirection', () => {
  it('should redirect root requests to /find-a-pharmacy/', async () => {
    const res = await chai.request(server).get('/');
    expect(res).to.have.status(200);
    expect(res).to.be.html;
    expect(res).to.redirect;
    expect(res.req.path).to.equal(`${constants.SITE_ROOT}`);
  });
});
