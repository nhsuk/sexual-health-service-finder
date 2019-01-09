function build(location) {
  return {
    search: location,
    select: 'Latitude,Longitude,Type,Name1',
    top: 1,
  };
}

module.exports = build;
