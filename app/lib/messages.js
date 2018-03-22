function invalidUrlMessage() {
  return 'This is not a valid url, please start again.';
}

function mandatorySelectionMessage() {
  return 'You must choose one of the options.';
}

function emptyPostcodeMessage() {
  return 'You must enter a postcode.';
}

function invalidPostcodeMessage(location) {
  return `We can't find the postcode '${location.toUpperCase()}'. Check the postcode is correct and try again.`;
}

function outsideOfEnglandPostcodeMessage() {
  /* eslint-disable quotes */
  return `This postcode is not in England. Get help to find a chlamydia test in \
<a href="/#scotland"><span class="sr-only">find a chlamydia test in </span>Scotland</a>, \
<a href="/#wales"><span class="sr-only">find a chlamydia test in </span> Wales</a> or \
<a href="/#northern"><span class="sr-only">find a chlamydia test in </span>Northern Ireland</a>.`;
  /* eslint-enable quotes */
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems.';
}

module.exports = {
  emptyPostcodeMessage,
  invalidPostcodeMessage,
  invalidUrlMessage,
  mandatorySelectionMessage,
  outsideOfEnglandPostcodeMessage,
  technicalProblems,
};
