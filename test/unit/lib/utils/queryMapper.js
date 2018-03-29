const chai = require('chai');
const constants = require('../../../../app/lib/constants');
const queryMapper = require('../../../../app/lib/utils/queryMapper');

const expect = chai.expect;

describe('queryMapper', () => {
  describe('getLocationHeading', () => {
    it('should return undefined when empty query', () => {
      const query = {};
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal(undefined);
    });

    it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
      const query = {
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to see a sexual health professional?');
    });

    it('should return a free kit message when the query is related to kit and age between 16 and 24', () => {
      const query = {
        origin: constants.serviceChoices['16to24'],
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to collect your free test kit?');
    });

    it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.kit,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('Where would you like to buy your test kit?');
    });

    it('should return a redirect message when the query is related to online', () => {
      const query = {
        origin: constants.serviceChoices.over25,
        type: constants.serviceTypes.online,
      };
      const output = queryMapper.getLocationHeading(query);
      expect(output).to.equal('redirect');
    });
  });

  describe('getResultsInfo', () => {
    it('should return undefined when empty query', () => {
      const query = {};
      const location = 'ls1';
      const output = queryMapper.getResultsInfo(query, location);
      expect(output).to.eql({
        correctResultsParams: undefined,
        resultsExplanation: undefined,
        resultsHeading: undefined,
        resultsOnwardsJourneyPartial: undefined,
      });
    });

    it('should return undefined when empty location', () => {
      const emptyLocation = undefined;
      const query = {
        origin: constants.serviceChoices.symptoms,
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.getResultsInfo(query, emptyLocation);
      expect(output).to.eql({
        correctResultsParams: undefined,
        resultsExplanation: undefined,
        resultsHeading: undefined,
        resultsOnwardsJourneyPartial: undefined,
      });
    });

    describe('resultsHeading', () => {
      const location = 'ls1';
      it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
        const query = {
          origin: constants.serviceChoices.symptoms,
          type: constants.serviceTypes.professional,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsHeading;
        expect(output).to.equal('Sexual health professionals near \'LS1\'');
      });

      it('should return a sexual professionals message when the query is related to professionals and age under 16', () => {
        const query = {
          origin: constants.serviceChoices.under16,
          type: constants.serviceTypes.professional,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsHeading;
        expect(output).to.equal('Sexual health professionals near \'LS1\'');
      });

      it('should return a free kit message when the query is related to kit and age between 16 and 25', () => {
        const query = {
          origin: constants.serviceChoices['16to24'],
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsHeading;
        expect(output).to.equal('Places you can collect a free test kit near \'LS1\'');
      });

      it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
        const query = {
          origin: constants.serviceChoices.over25,
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsHeading;
        expect(output).to.equal('Places you can buy a test kit near \'LS1\'');
      });
    });

    describe('resultsExplanation', () => {
      const location = 'ls1';
      it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
        const query = {
          origin: constants.serviceChoices.symptoms,
          type: constants.serviceTypes.professional,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsExplanation;
        expect(output).to.equal('Here is a list of places where you can get tested by a sexual health professional.');
      });

      it('should return a free kit message when the query is related to kit and age between 16 and 25', () => {
        const query = {
          origin: constants.serviceChoices['16to24'],
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsExplanation;
        expect(output).to.equal('Here is a list of places where you can get a free chlamydia test kit.');
      });

      it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
        const query = {
          origin: constants.serviceChoices.over25,
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsExplanation;
        expect(output).to.equal('Here is a list of pharmacies where you can buy a chlamydia test kit.');
      });
    });

    describe('resultsOnwardsJourneyPartial', () => {
      const location = 'ls1';
      it('should return alternative service links as free kit message when the query is related to professional and age between 16 and 25 partial', () => {
        const query = {
          origin: constants.serviceChoices['16to24'],
          type: constants.serviceTypes.professional,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsOnwardsJourneyPartial;
        expect(output).to.equal('includes/onwardsJourneyProfessional16to24.nunjucks');
      });

      it('should return alternative service links as paid for kit message when the query is related to professional and age is over 25 partial', () => {
        const query = {
          origin: constants.serviceChoices.over25,
          type: constants.serviceTypes.professional,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsOnwardsJourneyPartial;
        expect(output).to.equal('includes/onwardsJourneyProfessionalOver25.nunjucks');
      });
      it('should return alternative service links as free kit message when the query is related to kit and age between 16 and 25 partial', () => {
        const query = {
          origin: constants.serviceChoices['16to24'],
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsOnwardsJourneyPartial;
        expect(output).to.equal('includes/onwardsJourneyKit16to24.nunjucks');
      });

      it('should return alternative service links as paid for kit message when the query is related to kit and age is over 25 partial', () => {
        const query = {
          origin: constants.serviceChoices.over25,
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).resultsOnwardsJourneyPartial;
        expect(output).to.equal('includes/onwardsJourneyKitOver25.nunjucks');
      });
    });

    describe('correctResultsParams', () => {
      const location = 'ls1';
      it('should return a sexual professionals message when the query is related to professionals and origin is any', () => {
        const query = {
          origin: constants.serviceChoices.symptoms,
          type: constants.serviceTypes.professional,
        };
        const output = queryMapper.getResultsInfo(query, location).correctResultsParams;
        expect(output).to.equal(true);
      });

      it('should return a free kit message when the query is related to kit and age between 16 and 25', () => {
        const query = {
          origin: constants.serviceChoices['16to24'],
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).correctResultsParams;
        expect(output).to.equal(true);
      });

      it('should return a paid for kit message when the query is related to kit and age is over 25', () => {
        const query = {
          origin: constants.serviceChoices.over25,
          type: constants.serviceTypes.kit,
        };
        const output = queryMapper.getResultsInfo(query, location).correctResultsParams;
        expect(output).to.equal(true);
      });

      it('should return an undefined if the query is not right', () => {
        const query = {
          origin: constants.serviceChoices.over25,
          type: constants.serviceTypes.online,
        };
        const output = queryMapper.getResultsInfo(query, location).correctResultsParams;
        expect(output).to.equal(undefined);
      });
    });
  });

  describe('mapServiceType', () => {
    it('should return the query type if type is set', () => {
      const query = {
        type: constants.serviceTypes.professional,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.serviceTypes.professional);
    });

    it('should map to professional service type if query contains age is under 16', () => {
      const query = {
        age: constants.age.under16,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.serviceTypes.professional);
    });

    it('should map to professional service type if query contains symptoms', () => {
      const query = {
        symptoms: constants.symptoms.yes,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(constants.serviceTypes.professional);
    });

    it('should map to undefined if query contains no symptoms', () => {
      const query = {
        symptoms: constants.symptoms.false,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(undefined);
    });

    it('should map to undefined if query contains age is over 16', () => {
      const query = {
        age: constants.age.over25,
      };
      const output = queryMapper.mapServiceType(query);
      expect(output).to.equal(undefined);
    });
  });

  describe('mapServiceChoice', () => {
    it('should return the query origin if origin is set', () => {
      const query = {
        origin: constants.serviceChoices.symptoms,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.symptoms);
    });

    it('should map to under 16 service choice if query contains age is under 16', () => {
      const query = {
        age: constants.age.under16,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.under16);
    });

    it('should map to symptoms service choice if query contains symptoms', () => {
      const query = {
        symptoms: constants.symptoms.yes,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.symptoms);
    });

    it('should map to undefined if query contains no symptoms', () => {
      const query = {
        symptoms: constants.symptoms.false,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(undefined);
    });

    it('should map to 16 to 24 if query contains age is between 16 and 24', () => {
      const query = {
        age: constants.age['16to24'],
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices['16to24']);
    });

    it('should map to over 25 if query contains age is over 25', () => {
      const query = {
        age: constants.age.over25,
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(constants.serviceChoices.over25);
    });

    it('should map to undefined if no age or symptoms', () => {
      const query = {
      };
      const output = queryMapper.mapServiceChoice(query);
      expect(output).to.equal(undefined);
    });
  });
});
