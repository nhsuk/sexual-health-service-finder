const constants = require('../constants');
const utils = require('./utils');

function isProfessionalChoice(query) {
  return (utils.areEqual(query.type, constants.serviceTypes.professional)
    && (utils.getValues(constants.serviceChoices).includes(query.origin)));
}

function getAlternativeTypeFor(type) {
  if (type === constants.serviceTypes.professional) {
    return constants.serviceTypes.kit;
  } else if (type === constants.serviceTypes.kit) {
    return constants.serviceTypes.professional;
  }
  return type;
}

function getResultsInternalLink(query, location) {
  return `${constants.siteRoot}/results?location=${location}&type=${getAlternativeTypeFor(query.type)}&origin=${query.origin}`;
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
  let resultsOnwardsJourneyPartial = false;
  if (ageChoice === constants.serviceChoices['16to24']) {
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessional16to24.nunjucks';
  }
  if (ageChoice === constants.serviceChoices.over25) {
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessionalOver25.nunjucks';
  }
  return {
    correctResultsParams: true,
    resultsExplanation: 'Here is a list of places where you can get tested by a sexual health professional.',
    resultsHeading: `Sexual health professionals near '${location}'`,
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

function getResultsInfo(query, location) {
  if (location && query.type) {
    const mappedLocation = location.toUpperCase();
    const resultsInternalLink = getResultsInternalLink(query, location);
    if (isProfessionalChoice(query)) {
      const getResults = getResultsInfoForProfessionalsByAge(query.origin, mappedLocation);
      return {
        correctResultsParams: getResults.correctResultsParams,
        resultsExplanation: getResults.resultsExplanation,
        resultsHeading: getResults.resultsHeading,
        resultsInternalLink,
        resultsOnwardsJourneyPartial: getResults.resultsOnwardsJourneyPartial,
      };
    }
    if (utils.areEqual(query.type, constants.serviceTypes.kit)) {
      const getResults = getResultsInfoForKitsByAge(query.origin, mappedLocation);
      return {
        correctResultsParams: getResults.correctResultsParams,
        resultsExplanation: getResults.resultsExplanation,
        resultsHeading: getResults.resultsHeading,
        resultsInternalLink,
        resultsOnwardsJourneyPartial: getResults.resultsOnwardsJourneyPartial,
      };
    }
  }
  return {
    correctResultsParams: false,
    resultsExplanation: false,
    resultsHeading: false,
    resultsInternalLink: false,
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
  getResultsInternalLink,
  isProfessionalChoice,
  mapServiceChoice,
  mapServiceType,
};
