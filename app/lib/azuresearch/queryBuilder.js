const VError = require('verror').VError;

const queryTypes = require('../constants').queryTypes;

function build(searchOrigin, queryType, size) {
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
    orderby: `geo.distance(Geocode, geography'POINT(${searchOrigin.location.lon} ${searchOrigin.location.lat})')`,
    select: 'OrganisationName, Address1, Address2, Address3, City, County, Postcode, Geocode, Contacts, Metrics, GSD, OpeningTimes',
    top: size,
  };
}

module.exports = build;
