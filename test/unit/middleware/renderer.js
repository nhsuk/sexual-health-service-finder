const chai = require('chai');
const renderer = require('../../../app/middleware/renderer');
const constants = require('../../../app/lib/constants');
const spyUtils = require('../../lib/spy-utils');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;
const getSpy = spyUtils.getSpy;
const expectCalledOnce = spyUtils.expectCalledOnce;

describe('Postcode validation', () => {
  describe('error handling for outsideOfEngland', () => {
    it('should set a not England flag in the results', () => {
      const countries = ['Scotland'];
      const loc = 'EH1';
      const req = {
        query: {
          loc,
          origin: constants.SERVICE_CHOICES.symptoms,
          type: constants.SERVICE_TYPES.professional,
        },
      };
      const res = {
        locals: {
          correctLocationParams: true,
          loc,
          origin: constants.SERVICE_CHOICES.symptoms,
          postcodeLocationDetails: {
            countries,
            isOutcode: true,
          },
          type: constants.SERVICE_TYPES.professional,
        },
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('location');
        expect(res.locals.errorMessage).to.not.be.empty;
        expect(res.locals.errorMessage)
          .to.equal(messages.outsideOfEnglandPostcodeMessage());
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.outsideOfEngland(req, res, loc);

      expectCalledOnce(res.render);
    });
  });

  describe('error handling for render InvalidPostcode', () => {
    it('should return an error message when the postcode is invalid', () => {
      const loc = 'S50 3EW';
      const req = {
        query: {
          loc,
          origin: constants.SERVICE_CHOICES.symptoms,
          type: constants.SERVICE_TYPES.professional,
        },
      };

      const res = {
        locals: {
          correctLocationParams: true,
        },
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('location');
        // eslint-disable-next-line no-unused-expressions
        expect(res.locals.errorMessage).to.not.be.empty;
        expect(res.locals.errorMessage).to.equal(messages.invalidPostcodeMessage(loc));
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.invalidPostcode(req, res, loc);

      expectCalledOnce(res.render);
    });
  });
});
