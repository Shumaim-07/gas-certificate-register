export function generateCertificateRef(
  address: string,
  postcode: string,
  date: string
) {
  if (!address || !postcode || !date) return '';

  const doorNumber =
    address.match(/^\d+/)?.[0] || '000';

  const cleanPostcode = postcode
    .toUpperCase()
    .replace(/\s/g, '');

  const [year, month, day] = date.split('-');

  return `GAS-${doorNumber}${cleanPostcode}${day}${month}${year}`;
}