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
  return undefined;
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
  if ((ageChoice === constants.serviceChoices.symptoms)
    || (ageChoice === constants.serviceChoices.under16)) {
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessionalGp.nunjucks';
  }
  return {
    correctResultsParams,
    resultsExplanation,
    resultsHeading,
    resultsOnwardsJourneyPartial,
  };
}

function getResultsInfoForKitsByAge(ageChoice, location) {
  let correctResultsParams;
  let resultsExplanation;
  let resultsHeading;
  let resultsOnwardsJourneyPartial;
  if (ageChoice === constants.serviceChoices['16to24']) {
    resultsHeading = `Where you can pick up a free test kit near '${location}'`;
    resultsExplanation = 'You can pick up a chlamydia test kit from any of the places below. You\'ll take your own samples and ' +
      'send them by Freepost to be tested. You\'ll usually get the results within 2 weeks.';
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyKit16to24.nunjucks';
    correctResultsParams = true;
  } else if (ageChoice === constants.serviceChoices.over25) {
    resultsHeading = `Where you can buy a test near '${location}'`;
    resultsExplanation = 'You can buy a chlamydia test kit from any of the places below. You\'ll take your own samples and send ' +
      'them by Freepost to be tested. You\'ll usually get the results within 2 weeks.';
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyKitOver25.nunjucks';
    correctResultsParams = true;
  }
  return {
    correctResultsParams,
    resultsExplanation,
    resultsHeading,
    resultsOnwardsJourneyPartial,
  };
}

function getResultsInfo(query, loc) {
  let correctResultsParams;
  let resultsExplanation;
  let resultsHeading;
  let resultsOnwardsJourneyPartial;
  if (loc && query.type) {
    const location = loc.toUpperCase();
    if (isProfessionalChoice(query)) {
      /* eslint-disable max-len */
      correctResultsParams = getResultsInfoForProfessionalsByAge(query.origin, location).correctResultsParams;
      resultsHeading = getResultsInfoForProfessionalsByAge(query.origin, location).resultsHeading;
      resultsOnwardsJourneyPartial = getResultsInfoForProfessionalsByAge(query.origin, location).resultsOnwardsJourneyPartial;
      resultsExplanation = getResultsInfoForProfessionalsByAge(query.origin, location).resultsExplanation;
    }
    if (utils.areEqual(query.type, constants.serviceTypes.kit)) {
      correctResultsParams = getResultsInfoForKitsByAge(query.origin, location).correctResultsParams;
      resultsHeading = getResultsInfoForKitsByAge(query.origin, location).resultsHeading;
      resultsOnwardsJourneyPartial = getResultsInfoForKitsByAge(query.origin, location).resultsOnwardsJourneyPartial;
      resultsExplanation = getResultsInfoForKitsByAge(query.origin, location).resultsExplanation;
      /* eslint-enable max-len */
    }
  }
  return {
    correctResultsParams,
    resultsExplanation,
    resultsHeading,
    resultsOnwardsJourneyPartial,
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
  return undefined;
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
  return undefined;
}

module.exports = {
  getLocationHeading,
  getResultsInfo,
  mapServiceChoice,
  mapServiceType,
};
