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
      expect(mappedContacts.telephone).to.equal(telephone);
    });

    it('should return the website address', () => {
      expect(mappedContacts.website).to.equal(website);
    });
  });

  describe('no Contacts to map from', () => {
    it('should not add a contacts property', () => {
      const mappedContacts = mapContacts({});

      expect(mappedContacts).to.not.have.property('contacts');
    });
  });

  describe('Contacts with no contact properties to map from', () => {
    const mappedContacts = mapContacts({ Contacts: JSON.stringify([]) });

    it('should not add an email property when there is no email contact method', () => {
      expect(mappedContacts).to.not.have.property('email');
    });

    it('should not add a telephone property when there is no telephone contact method', () => {
      expect(mappedContacts).to.not.have.property('telephone');
    });

    it('should not add a website property when there is no website contact method', () => {
      expect(mappedContacts).to.not.have.property('website');
    });
  });

  describe('invalid JSON Contacts', () => {
    it('should return undefined', () => {
      const mappedContacts = mapContacts({ Contacts: '[{]' });

      expect(mappedContacts).to.be.undefined;
    });
  });
});

