//var CryptoJS = require("crypto-js");
import * as CryptoJS from "crypto-js";
export function encrypt(secretKey, text) {
  var ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
}

export function decrypt(secretKey, text) {
  var bytes = CryptoJS.AES.decrypt(text, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
