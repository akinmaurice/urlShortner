const alphabets = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const base = alphabets.length; // 58 length of alphabets total number of available xters
// CONVERT URL INTO CODES
exports.encodeUrl = function (num) {
  let encoded = '';
  while (num) {
    const remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabets[remainder].toString() + encoded;
  }
  return encoded;
};
// DECODE URL CODES
exports.decodeUrl = function (str) {
  let decoded = 0;
  while (str) {
    const index = alphabets.indexOf(str[0]);
    const power = str.length - 1;
    decoded += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return decoded;
};
