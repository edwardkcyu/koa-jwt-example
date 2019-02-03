const crypto = require('crypto');

function hash(data) {
  const hash = crypto.createHash('sha256');
  const hashedData = hash.update(data).digest('hex');

  return hashedData;
}

module.exports = {
  hash
};
