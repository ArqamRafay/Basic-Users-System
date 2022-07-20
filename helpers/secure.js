const asyncHandler = require("./asyncMiddleware");
const CryptoJS = require('crypto-js');
const crypto = require("crypto");

const decrypt = (req) => {
  if (req && req.body && req.body.data ) {
    var bytes  = CryptoJS.AES.decrypt(req.body.data.toString(), 'secret123456145674125896', { iv: "secret1234561456" });
    req['body'] = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  return req;
}

const encrypt = res => {
  return CryptoJS.AES.encrypt(JSON.stringify(JSON.parse(JSON.stringify(res))), 'secret123456145674125896', { iv: "secret1234561456" }).toString();
  // return res;
}

const salesforceDecrypt = (req) => {
  // var data = {
  // 'abc': 'VALUES of',
  // 'abc2': 'VALUES of',
  // 'abc3': 'VALUES of'
  // };
  // if (req && req.body && req.body.data ) {
  var decipher = crypto.createDecipheriv('aes192', "secret123456145674125896","secret1234561456");
  var dec = decipher.update(req,'base64','utf8');
  dec += decipher.final('utf8');

  // }
  return dec;
}

const salesforceEncrypt = (req) => {
  // var data = {
  // 'abc': 'VALUES of',
  // 'abc2': 'VALUES of',
  // 'abc3': 'VALUES of'
  // };
  // if (req && req.body && req.body.data ) {
  var cipher = crypto.createCipheriv('aes192', "secret123456145674125896","secret1234561456");
  var ci = cipher.update(req,'utf8','base64');
  ci += cipher.final('base64');

  // }
  return ci;
}

module.exports = {
  decrypt,
  encrypt,
  salesforceEncrypt,
  salesforceDecrypt
}
