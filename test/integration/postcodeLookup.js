const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const spyUtils = require('../lib/spy-utils');
/* eslint-disable camelcase */
const postcodeSampleResponse_HG50JL = require('../resources/postcodeResponse_HG50JL');
const outcodeSampleResponse_HG5 = require('../resources/outcodeResponse_HG5');
const outcodeSampleResponseCrossBorder_TD9 = require('../resources/outcodeResponseCrossBorder_TD9');
/* eslint-enable camelcase */

const expect = chai.expect;
const getNextSpy = spyUtils.getNextSpy;
const expectCalledOnce = spyUtils.expectCalledOnce;

function getRejectingPostcodeIOClientFake(error) {
  return {
    lookup: sinon.stub().rejects(error),
  };
}

function getResolvingPostcodeIOClientFake(response) {
  return {
    lookup: sinon.stub().resolves(response),
  };
}

function getRendererFake(methodName) {
  const fake = {};
  fake[methodName] = sinon.spy();
  return fake;
}

function getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake) {
  const postcodeLookup = rewire('../../app/middleware/postcodeLookup');

  // eslint-disable-next-line no-underscore-dangle
  postcodeLookup.__set__('PostcodesIO', postcodesIOClientFake);

  // eslint-disable-next-line no-underscore-dangle
  postcodeLookup.__set__('renderer', rendererFake);

  return postcodeLookup;
}

describe('Postcode lookup', () => {
  describe('PostcodeIO error handling', () => {
    it('should call next with error when postcode.io is not available', async () => {
      const error = Error('Error!');

      const postcodesIOClientFake = getRejectingPostcodeIOClientFake(error);
      const next = getNextSpy();

      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      await postcodeLookup({}, { locals: { location: 'HG5 0JL' } }, next);

      expect(next.calledWith(error)).to.equal(true, 'next error called');
    });

    it('should call invalidPostcode when the postcode cannot be found', async () => {
      const res = { locals: { location: 'HG5 123' } };
      const postcodesIOClientFake = getResolvingPostcodeIOClientFake();
      const rendererFake = getRendererFake('invalidPostcode');

      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake, rendererFake);

      await postcodeLookup({}, res);

      expect(rendererFake.invalidPostcode.calledWith({}, res, 'HG5 123')).to.equal(true, 'invalidPostcode called');
    });
  });

  describe('should set locals', () => {
    describe('country should always be mapped to an array', () => {
      // postcode.io returns country as a string for postcodes and array for outcodes
      it('postcode string country should be mapped to array', async () => {
        const res = { locals: { location: 'HG5 0JL' } };
        const postcodesIOClientFake =
          getResolvingPostcodeIOClientFake(postcodeSampleResponse_HG50JL);
        const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

        const next = getNextSpy();

        await postcodeLookup({}, res, next);

        expectCalledOnce(next);
        const countries = res.locals.postcodeLocationDetails.countries;
        expect(countries).to.be.an.instanceOf(Array)
          .and.to.have.lengthOf(1)
          .and.to.include.members(['England']);
      });

      it('outcode string array of countries should be preserved as array', async () => {
        // postcode.io returns country as a string for postcodes and array for outcodes
        const res = { locals: { location: 'TD9' } };
        const postcodesIOClientFake =
          getResolvingPostcodeIOClientFake(outcodeSampleResponseCrossBorder_TD9);
        const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

        const next = getNextSpy();

        await postcodeLookup({}, res, next);

        expectCalledOnce(next);
        const countries = res.locals.postcodeLocationDetails.countries;
        expect(countries).to.be.an.instanceOf(Array)
          .and.to.have.lengthOf(2)
          .and.to.include.members(['England', 'Scotland']);
      });
    });

    it('outcode flag should be set to false for postcodes', async () => {
      const res = { locals: { location: 'HG5 0JL' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(postcodeSampleResponse_HG50JL);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(false, 'res.locals.postcodeLocationDetails.isOutcode');
    });

    it('outcode flag should be set to true for outcodes', async () => {
      const res = { locals: { location: 'HG5' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(outcodeSampleResponse_HG5);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.isOutcode).to.equal(true, 'res.locals.postcodeLocationDetails.isOutcode');
    });

    it('coordinates should be set for postcode', async () => {
      const res = { locals: { location: 'HG5 0JL' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(postcodeSampleResponse_HG50JL);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.location.lat).to.equal(54.0095586395326);
      expect(res.locals.postcodeLocationDetails.location.lon).to.equal(-1.46519099452929);
    });

    it('coordinates should be set for outcode', async () => {
      const res = { locals: { location: 'HG5' } };
      const postcodesIOClientFake =
        getResolvingPostcodeIOClientFake(outcodeSampleResponse_HG5);
      const postcodeLookup = getRewiredPostcodeLookup(postcodesIOClientFake);

      const next = getNextSpy();

      await postcodeLookup({}, res, next);

      expectCalledOnce(next);
      expect(res.locals.postcodeLocationDetails.location.lat).to.equal(54.0133515811383);
      expect(res.locals.postcodeLocationDetails.location.lon).to.equal(-1.45795488599241);
    });
  });

  it('should not pass postcode location details to next when the postcode is empty', async () => {
    const postcodeLookup = getRewiredPostcodeLookup();

    const res = { locals: { location: '' } };

    const next = getNextSpy();

    await postcodeLookup({}, res, next);

    expect(res.locals.postcodeLocationDetails).to.equal(undefined, 'res.locals.postcodeLocationDetails');

    expectCalledOnce(next);
  });
});
