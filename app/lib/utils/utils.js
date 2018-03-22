function areEqual(queryItem, item) {
  return (queryItem.localeCompare(item, 'en', { sensitivity: 'base' }) === 0);
}

function getValues(myHash) {
  const keys = Object.keys(myHash);

  return keys.map(v => myHash[v]);
}

module.exports = {
  areEqual,
  getValues,
};
