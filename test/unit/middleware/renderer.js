const chai = require('chai');
const renderer = require('../../../app/middleware/renderer');
const constants = require('../../../app/lib/constants');
const spyUtils = require('../../lib/spy-utils');
const messages = require('../../../app/lib/messages');

const expect = chai.expect;
const getSpy = spyUtils.getSpy;
const expectCalledOnce = spyUtils.expectCalledOnce;

describe('Postcode validation', () => {
  describe('error handling for handlePostcodeError', () => {
    it('should set error message to technical error when an error is passed', () => {
      const location = 'S3';
      const res = {
        locals: {}
      };

      const localsExpectations = (error) => {
        expect(error).to.equal('Some error');
        // eslint-disable-next-line no-unused-expressions
        expect(res.locals.errorMessage).to.not.be.empty;
        expect(res.locals.errorMessage).to.equal(messages.technicalProblems());
      };

      const nextSpy = getSpy('next', localsExpectations);

      renderer.postcodeError('Some error', location, res, nextSpy);

      expectCalledOnce(nextSpy);
    });
  });

  describe('error handling for postcodeError', () => {
    it('should set a not England flag in the results', () => {
      const countries = ['Scotland'];
      const location = 'EH1';
      const req = {
        query: {
          location,
          type: constants.SERVICE_TYPES.professional,
          origin: constants.SERVICE_CHOICES.symptoms
        }
      };
      const res = {
        locals: {
          location,
          type: constants.SERVICE_TYPES.professional,
          origin: constants.SERVICE_CHOICES.symptoms,
          postcodeLocationDetails: {
            isOutcode: true,
            countries
          }
        }
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('location');
        expect(res.locals.errorMessage)
          .to.equal(messages.outsideOfEnglandPostcodeMessage());
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.outsideOfEnglandPage(location, req, res);

      expectCalledOnce(res.render);
    });
  });

  describe('results', () => {
    xit('should render results page when there are services', () => {
    });

    xit('should render no results page when there are no services', () => {
    });
  });

  describe('error handling for renderInvalidPostcodePage', () => {
    it('should return an error message when the postcode is invalid', () => {
      const location = 'S50 3EW';
      const req = {};

      const res = {
        locals: {}
      };

      const localsExpectations = (viewName) => {
        expect(viewName).to.equal('location');
        // eslint-disable-next-line no-unused-expressions
        expect(res.locals.errorMessage).to.not.be.empty;
        expect(res.locals.errorMessage).to.equal(messages.invalidPostcodeMessage(location));
      };

      res.render = getSpy('res.render', localsExpectations);

      renderer.invalidPostcodePage(location, req, res);

      expectCalledOnce(res.render);
    });
  });
});
