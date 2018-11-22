function mapAddress(service) {
  const address = [];
  address.push(service.Address1);
  address.push(service.Address2);
  address.push(service.Address3);
  address.push(service.City);
  address.push(service.County);
  address.push(service.Postcode);
  return address.filter(Boolean).join(', ');
}

module.exports = mapAddress;
