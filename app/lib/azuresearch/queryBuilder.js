const VError = require('verror').VError;

const queryTypes = require('../constants').queryTypes;

function build(location, queryType, size) {
  let filter;

  switch (queryType) {
    case queryTypes.kitsOver25:
      filter = 'ServiceCodesProvided/any(s: s eq \'SRV0531\')';
      break;
    case queryTypes.kits16to24:
      filter = '(ServiceCodesProvided/any(g: g eq \'SRV0267\')) or (ServicesProvided/any(f: f eq \'Sexual health information and support\') and VenueType eq \'Community\') or (ServicesProvided/any(f: f eq \'Chlamydia screening under 25s\') and search.in(VenueType, \'Clinic,Community\')) and not (search.ismatch(\'Marie Stopes\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'Young People Friendly Practice\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'BPAS\', \'OrganisationName\', \'simple\', \'all\'))';
      break;
    case queryTypes.sexperts:
      filter = 'ServicesProvided/any(s: s eq \'Sexual health information and support\') and VenueType eq \'Clinic\' and not (search.ismatch(\'Marie Stopes\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'Young People Friendly Practice\', \'OrganisationName\', \'simple\', \'all\') or search.ismatch(\'BPAS\', \'OrganisationName\', \'simple\', \'all\'))';
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
