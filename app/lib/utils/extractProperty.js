const VError = require('verror').VError;

const log = require('../logger');

function extractProperty(opts, jsonString) {
  if (!jsonString) { return undefined; }

  let json;
  try {
    json = JSON.parse(jsonString);
    if (!json) { return undefined; }
  } catch (err) {
    const msg = 'Error parsing JSON string during property extraction.';
    const error = new VError(err.stack, msg);
    log.error({ err: error, opts }, msg);

    return undefined;
  }

  const matchedItem = json.find(item => item[opts.searchTargetKey] === opts.searchTargetValue);
  if (!matchedItem) { return undefined; }

  return matchedItem[opts.extractionTargetKey];
}

module.exports = extractProperty;
