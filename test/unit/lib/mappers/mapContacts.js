const chai = require('chai');
const mapContacts = require('../../../../app/lib/mappers/mapContacts');

const expect = chai.expect;

describe('formatContacts', () => {
  describe('happy path', () => {
    const email = 'name@domain.com';
    const telephone = '0800 123 456';
    const website = 'https://a.web.site';
    const contacts = [
      { OrganisationContactMethodType: 'Telephone', OrganisationContactValue: telephone },
      { OrganisationContactMethodType: 'Email', OrganisationContactValue: email },
      { OrganisationContactMethodType: 'Website', OrganisationContactValue: website },
    ];

    let mappedContacts;
    const service = {
      Contacts: JSON.stringify(contacts),
    };

    before('execute function', () => {
      mappedContacts = mapContacts(service);
    });

    it('should return the email address', () => {
      expect(mappedContacts.email).to.equal(email);
    });

    it('should return the telephone number', () => {
      expect(mappedContacts.telephoneNumber).to.equal(telephone);
    });

    it('should return the website address', () => {
      expect(mappedContacts.website).to.equal(website);
    });
  });

  describe('no Contacts to map from', () => {
    it('should return undefined when there is no Contacts property', () => {
      const mappedContacts = mapContacts({});

      expect(mappedContacts).to.be.undefined;
    });

    it('should return undefined when Contacts is empty', () => {
      const mappedContacts = mapContacts({ Contacts: '' });

      expect(mappedContacts).to.be.undefined;
    });

    it('should return undefined when Contacts does not contain any known ContactTypes', () => {
      const contactsWithNoKnownContactMethodType = [{ OrganisationContactMethodType: 'Unknown', OrganisationContactValue: 'should not return this' }];

      const mappedContacts = mapContacts(JSON.stringify(contactsWithNoKnownContactMethodType));

      expect(mappedContacts).to.be.undefined;
    });
  });

  describe('Contacts with no contact properties to map from', () => {
    const mappedContacts = mapContacts({ Contacts: JSON.stringify([]) });

    it('should return undefined', () => {
      expect(mappedContacts).to.be.undefined;
    });
  });

  describe('invalid JSON Contacts', () => {
    it('should return undefined', () => {
      const mappedContacts = mapContacts({ Contacts: '[{]' });

      expect(mappedContacts).to.be.undefined;
    });
  });
});
