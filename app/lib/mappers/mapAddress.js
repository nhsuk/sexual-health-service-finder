function mapAddress(service) {
  const address = [];
  address.push(service.Address1);
  address.push(service.Address2);
  address.push(service.Address3);
  address.push(service.City);
  address.push(service.County);
  address.push(service.Postcode);
  const filteredAddress = address.filter(Boolean);
  if (filteredAddress.length) {
    return filteredAddress.join(', ');
  }
  return [];
}

module.exports = mapAddress;
