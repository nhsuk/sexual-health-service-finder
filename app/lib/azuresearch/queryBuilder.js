const VError = require('verror').VError;

const queryTypes = require('../constants').queryTypes;

function build(location, queryType, size) {
  let filter;

  switch (queryType) {
    case queryTypes.kitsOver25:
      filter = 'ServiceCodesProvided/any(s: s eq \'SRV0531\')';
      break;
    case queryTypes.kits16to24:
      filter = '(ServiceCodesProvided/any(g: g eq \'SRV0267\')) or (ServicesProvided/any(f: f eq \'Sexual health information and support\') and VenueType eq \'Community\') or (ServicesProvided/any(f: f eq \'Chlamydia screening under 25s\') and (VenueType eq \'Clinic\' or VenueType eq \'Community\')) and not search.in(OrganisationName, \'Marie Stopes,Young People Friendly Practice,BPAS\', \',\')';
      break;
    case queryTypes.sexperts:
      filter = '(ServiceCodesProvided/any(g: g eq \'SRV0267\')) or (ServicesProvided/any(f: f eq \'Sexual health information and support\') and VenueType eq \'Community\') or (ServicesProvided/any(f: f eq \'Chlamydia screening under 25s\') and (VenueType eq \'Clinic\' or VenueType eq \'Community\')) and not search.in(OrganisationName, \'Marie Stopes,Young People Friendly Practice,BPAS\', \',\')';
      break;
    default:
      throw new VError(`Unknown queryType: ${queryType}`);
  }

  return {
    count: true,
    filter,
    orderby: `geo.distance(Geocode, geography'POINT(${location.lon} ${location.lat})')`,
    top: size,
  };
}

module.exports = build;
