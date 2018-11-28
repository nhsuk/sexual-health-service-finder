function getTextOnlyFromElement(element) {
  return element.text().trim().replace('\n', '');
}

module.exports = {
  getTextOnlyFromElement,
};
