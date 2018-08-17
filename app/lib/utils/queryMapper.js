const constants = require('../constants');
const utils = require('./utils');

function getEsQueryType(type, origin) {
  if (type === constants.serviceTypes.professional) {
    return constants.searchTypes.sexperts;
  }
  if (type === constants.serviceTypes.kit) {
    if (origin === constants.serviceChoices['16to24']) {
      return constants.searchTypes.kits16to24;
    }
    if (origin === constants.serviceChoices.over25) {
      return constants.searchTypes.kitsOver25;
    }
  }
  return constants.searchTypes.sexperts;
}

function getLocationInfo(query) {
  if (query.type) {
    if (utils.isProfessionalChoice(query)) {
      return {
        analyticsPageTitle: 'PostcodeSexpert',
        correctLocationParams: true,
        locationHeading: 'Where would you like to see a sexual health professional?',
      };
    }
    if (utils.areEqual(query.type, constants.serviceTypes.kit)) {
      if (query.origin === constants.serviceChoices['16to24']) {
        return {
          analyticsPageTitle: 'PostcodeFreeKit',
          correctLocationParams: true,
          locationHeading: 'Where would you like to collect a free test kit?',
        };
      }
      if (query.origin === constants.serviceChoices.over25) {
        return {
          analyticsPageTitle: 'PostcodeBuyKit',
          correctLocationParams: true,
          locationHeading: 'Where would you like to buy your test kit?',
        };
      }
    }
    if (utils.areEqual(query.type, constants.serviceTypes.online)) {
      return {
        analyticsPageTitle: 'RedirectToChoices',
        correctLocationParams: true,
        locationHeading: 'redirect',
      };
    }
  }
  return {
    analyticsPageTitle: undefined,
    correctLocationParams: undefined,
    locationHeading: undefined,
  };
}

function getResultsInfoForProfessionalsByAge(ageChoice, location) {
  let resultsOnwardsJourneyPartial;
  let analyticsPageTitle;
  if (ageChoice === constants.serviceChoices.symptoms
    || ageChoice === constants.serviceChoices.under16) {
    analyticsPageTitle = 'ResultsSexpertRecommendation';
  } else if (ageChoice === constants.serviceChoices['16to24']) {
    analyticsPageTitle = 'ResultsSexpert16-24';
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessional16to24.nunjucks';
  } else if (ageChoice === constants.serviceChoices.over25) {
    analyticsPageTitle = 'ResultsSexpert25+';
    resultsOnwardsJourneyPartial = 'includes/onwardsJourneyProfessionalOver25.nunjucks';
  }
  return {
    analyticsPageTitle,
    correctResultsParams: true,
    resultsExplanation: 'You can get tested for chlamydia at these places.',
    resultsHeading: `Sexual health professionals near '${location}'`,
    resultsOnwardsJourneyPartial,
  };
}

function getResultsInfoForKitsByAge(ageChoice, location) {
  if (ageChoice === constants.serviceChoices['16to24']) {
    return {
      analyticsPageTitle: 'ResultsFreeKit',
      correctResultsParams: true,
      resultsExplanation: 'You can get a free chlamydia test kit from these places.',
      resultsHeading: `Places you can collect a free test kit near '${location}'`,
      resultsOnwardsJourneyPartial: 'includes/onwardsJourneyKit16to24.nunjucks',
    };
  }
  if (ageChoice === constants.serviceChoices.over25) {
    return {
      analyticsPageTitle: 'ResultsBuyKit',
      correctResultsParams: true,
      resultsExplanation: 'You can buy a test kit from these places.',
      resultsHeading: `Places you can buy a test kit near '${location}'`,
      resultsOnwardsJourneyPartial: 'includes/onwardsJourneyKitOver25.nunjucks',
    };
  }
  return {
    analyticsPageTitle: undefined,
    correctResultsParams: undefined,
    resultsExplanation: undefined,
    resultsHeading: undefined,
    resultsOnwardsJourneyPartial: undefined,
  };
}

function getResultsInfo(query, location) {
  if (location && query.type) {
    const mappedLocation = location.toUpperCase();
    const resultsInternalUrl = utils.getResultsInternalUrl(query, location);
    if (utils.isProfessionalChoice(query)) {
      const getResults = getResultsInfoForProfessionalsByAge(query.origin, mappedLocation);
      return {
        analyticsPageTitle: getResults.analyticsPageTitle,
        correctResultsParams: getResults.correctResultsParams,
        resultsExplanation: getResults.resultsExplanation,
        resultsHeading: getResults.resultsHeading,
        resultsInternalUrl,
        resultsOnwardsJourneyPartial: getResults.resultsOnwardsJourneyPartial,
      };
    }
    if (utils.areEqual(query.type, constants.serviceTypes.kit)) {
      const getResults = getResultsInfoForKitsByAge(query.origin, mappedLocation);
      return {
        analyticsPageTitle: getResults.analyticsPageTitle,
        correctResultsParams: getResults.correctResultsParams,
        resultsExplanation: getResults.resultsExplanation,
        resultsHeading: getResults.resultsHeading,
        resultsInternalUrl,
        resultsOnwardsJourneyPartial: getResults.resultsOnwardsJourneyPartial,
      };
    }
  }
  return {
    analyticsPageTitle: undefined,
    correctResultsParams: undefined,
    resultsExplanation: undefined,
    resultsHeading: undefined,
    resultsInternalUrl: undefined,
    resultsOnwardsJourneyPartial: undefined,
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
  getEsQueryType,
  getLocationInfo,
  getResultsInfo,
  mapServiceChoice,
  mapServiceType,
};
