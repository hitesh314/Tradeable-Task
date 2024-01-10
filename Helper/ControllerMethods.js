const crypto = require('crypto');

//Created a unique token every time the function is called using crypto library.
exports.generateUniqueToken = () => {
  const currentTimestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const uniqueToken = crypto.createHash('sha256').update(currentTimestamp + randomBytes).digest('hex');
  return uniqueToken;
}