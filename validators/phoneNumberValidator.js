const PhoneNumber = require('libphonenumber-js');

exports.checkPhoneNumber = (phoneNumber) => {
  // Parse the phone number
  const parsedNumber = PhoneNumber.parse(phoneNumber);

  if (!parsedNumber) {
    return 'invalid';
  }

  // Check if the phone number is valid
  if (!PhoneNumber.isValidNumber(parsedNumber)) {
    return 'invalid';
  }

  // Check if the phone number is international
  if (parsedNumber.country === 'ZZ') {
    return 'international';
  }

  // Check if the phone number is Indian
  if (parsedNumber.country === 'IN') {
    return 'indian';
  }

  // If the country is neither India nor International, consider it invalid
  return 'invalid';
}

// Example usage:
// const phoneNumber1 = '+91 9876543210'; // Indian number
// const phoneNumber2 = '+1 1234567890'; // International number

// console.log(checkPhoneNumber(phoneNumber1)); // Output: Indian phone number
// console.log(checkPhoneNumber(phoneNumber2)); // Output: International phone number
