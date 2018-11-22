function build(location, searchType, size) {
  return {
    count: true,
    filter: 'OrganisationTypeID eq \'GSD\' and ServicesProvided/any(x: search.in(x, \'Chlamydia screening under 25s,Sexual health information and support\', \',\')) or ServiceCodesProvided/any(scp: search.in(scp, \'SRV0267,SRV0531\'))',
    orderby: `geo.distance(Geocode, geography'Point(${location.lon} ${location.lat})')`,
    search: '*',
    select: '*',
    top: size,
  };
}

module.exports = {
  build,
};
