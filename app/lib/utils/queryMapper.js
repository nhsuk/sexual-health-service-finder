const constants = require('../constants');
const utils = require('./utils');

function isProfessionalChoice(query) {
  return (utils.areEqual(query.type, constants.serviceTypes.professional)
    && (utils.getValues(constants.serviceChoices).includes(query.origin)));
}

function getLocationHeading(query) {
  if (query.type) {
    if (isProfessionalChoice(query)) {
      return 'Where would you like to see a sexual health professional?';
    }
    if (utils.areEqual(query.type, constants.serviceTypes.kit)) {
      if (query.origin === constants.serviceChoices['16to24']) {
        return 'Where would you like to collect your free test kit?';
      } else if (query.origin === constants.serviceChoices.over25) {
        return 'Where would you like to buy your test kit?';
      }
    }
    if (utils.areEqual(query.type, constants.serviceTypes.online)) {
      return 'redirect';
    }
  }
  return false;
}

function getResultsInfoForProfessionalsByAge(ageChoice, location) {
  const correctResultsParams = true;
  const resultsHeading = `Sexual health professionals near '${location}'`;
  const resultsExplanation = 'Here is a list of places where you can get tested by a sexual health professional.';
  let resultsOnwardsJourneyPartial;
  if (ageChoice === constants.serviceChoices['16to24']) {
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessional16to24.nunjucks';
  }
  if (ageChoice === constants.serviceChoices.over25) {
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessionalOver25.nunjucks';
  }
  return {
    correctResultsParams,
    resultsExplanation,
    resultsHeading,
    resultsOnwardsJourneyPartial,
  };
}

function getResultsInfoForKitsByAge(ageChoice, location) {
  if (ageChoice === constants.serviceChoices['16to24']) {
    return {
      correctResultsParams: true,
      resultsExplanation: 'Here is a list of places where you can get a free chlamydia test kit.',
      resultsHeading: `Places you can collect a free test kit near '${location}'`,
      resultsOnwardsJourneyPartial: 'includes/onwardsJourneyKit16to24.nunjucks',
    };
  } else if (ageChoice === constants.serviceChoices.over25) {
    return {
      correctResultsParams: true,
      resultsExplanation: 'Here is a list of pharmacies where you can buy a chlamydia test kit.',
      resultsHeading: `Places you can buy a test kit near '${location}'`,
      resultsOnwardsJourneyPartial: 'includes/onwardsJourneyKitOver25.nunjucks',
    };
  }
  return {
    correctResultsParams: false,
    resultsExplanation: false,
    resultsHeading: false,
    resultsOnwardsJourneyPartial: false,
  };
}

function getResultsInfo(query, loc) {
  if (loc && query.type) {
    const location = loc.toUpperCase();
    if (isProfessionalChoice(query)) {
      /* eslint-disable max-len */
      return {
        correctResultsParams: getResultsInfoForProfessionalsByAge(query.origin, location).correctResultsParams,
        resultsExplanation: getResultsInfoForProfessionalsByAge(query.origin, location).resultsExplanation,
        resultsHeading: getResultsInfoForProfessionalsByAge(query.origin, location).resultsHeading,
        resultsOnwardsJourneyPartial: getResultsInfoForProfessionalsByAge(query.origin, location).resultsOnwardsJourneyPartial,
      };
    }
    if (utils.areEqual(query.type, constants.serviceTypes.kit)) {
      return {
        correctResultsParams: getResultsInfoForKitsByAge(query.origin, location).correctResultsParams,
        resultsExplanation: getResultsInfoForKitsByAge(query.origin, location).resultsExplanation,
        resultsHeading: getResultsInfoForKitsByAge(query.origin, location).resultsHeading,
        resultsOnwardsJourneyPartial: getResultsInfoForKitsByAge(query.origin, location).resultsOnwardsJourneyPartial,
      };
      /* eslint-enable max-len */
    }
  }
  return {
    correctResultsParams: false,
    resultsExplanation: false,
    resultsHeading: false,
    resultsOnwardsJourneyPartial: false,
  };
}

function mapServiceType(query) {
  if (query.type) {
    return query.type;
  }
  if ((query.age && (query.age === constants.age.under16))
    || (query.symptoms && (query.symptoms === constants.symptoms.yes))) {
    return constants.serviceTypes.professional;
  }
  return false;
}

function mapServiceChoice(query) {
  if (query.origin) {
    return query.origin;
  }

  if (query.symptoms && (query.symptoms === constants.symptoms.yes)) {
    return constants.serviceChoices.symptoms;
  }

  if (query.age) {
    if (query.age === constants.age.under16) {
      return constants.serviceChoices.under16;
    }
    if (query.age === constants.age['16to24']) {
      return constants.serviceChoices['16to24'];
    }
    if (query.age === constants.age.over25) {
      return constants.serviceChoices.over25;
    }
  }
  return false;
}

module.exports = {
  getLocationHeading,
  getResultsInfo,
  mapServiceChoice,
  mapServiceType,
};
