const extractProperty = require('../utils/extractProperty');
const phoneNumberParser = require('../phoneNumberParser');

function extractContact(type, data) {
  const opts = {
    extractionTargetKey: 'OrganisationContactValue',
    searchTargetKey: 'OrganisationContactMethodType',
    searchTargetValue: type.targetKey,
  };

  return {
    key: type.newKey,
    value: extractProperty(opts, data),
  };
}

function mapContacts(service) {
  const data = service.Contacts;

  if (!data) { return undefined; }

  // TODO: Pull these keys out into a shared module
  const types = [
    { newKey: 'email', targetKey: 'Email' },
    { newKey: 'telephoneNumber', targetKey: 'Telephone' },
    { newKey: 'website', targetKey: 'Website' },
  ];

  let contacts;

  types.map(type => extractContact(type, data)).forEach((item) => {
    if (item.value) {
      let value;
      if (item.key === 'telephoneNumber') {
        value = phoneNumberParser(item.value);
      }
      contacts = contacts || {};
      contacts[item.key] = value || item.value;
    }
  });

  return contacts;
}

module.exports = mapContacts;
