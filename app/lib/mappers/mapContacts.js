const extractProperty = require('../utils/extractProperty');

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

  const types = [
    { newKey: 'email', targetKey: 'Email' },
    { newKey: 'telephoneNumber', targetKey: 'Telephone' },
    { newKey: 'website', targetKey: 'Website' },
  ];

  let contacts;

  types.map(type => extractContact(type, data)).forEach((item) => {
    if (item.value) {
      contacts = contacts || {};
      contacts[item.key] = item.value;
    }
  });

  return contacts;
}

module.exports = mapContacts;
