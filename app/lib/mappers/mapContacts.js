const VError = require('verror').VError;

const log = require('../logger');

function mapContactMethod(service, contacts, methodType) {
  const result = contacts.find(contact => contact.OrganisationContactMethodType === methodType);
  if (result) {
    return result.OrganisationContactValue;
  }
  return undefined;
}

function mapContacts(service) {
  if (!service.Contacts) { return undefined; }

  let contacts;
  try {
    contacts = JSON.parse(service.Contacts);
    const contactMethodTypes = ['Email', 'Telephone', 'Website'];
    contacts = contactMethodTypes
      .forEach(methodType => mapContactMethod(service, contacts, methodType));
  } catch (err) {
    const msg = `Error parsing JSON for 'Contacts' for OrganisationID: ${service.OrganisationID}.`;
    const error = new VError(err.stack, msg);
    log.error({ err: error }, msg);
  }

  return contacts;
}

module.exports = mapContacts;
