const db = require('../lib/database');

function getUserModel() {
  return db.getCollection('users');
}

module.exports = {
  getUserModel
};
