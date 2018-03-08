const chai = require('chai');

const expect = chai.expect;

function htmlWith200Status(res) {
  expect(res).to.have.status(200);
  expect(res).to.be.html;
}

module.exports = {
  htmlWith200Status,
};
