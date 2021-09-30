var CryptoJS = require("crypto-js");

const encrypt = (secretKey, text) => {
  var ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
};

const decrypt = (secretKey, text) => {
  var bytes = CryptoJS.AES.decrypt(text, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports = {
  encrypt,
  decrypt,
};
