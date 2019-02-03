const loki = require('lokijs');
const logger = require('./logger');

const db = new loki('data.db', {
  autosave: true,
  autosaveInterval: 4000
});

function databaseInitialize() {
  const users = db.getCollection('users');
  if (users === null) {
    logger.info('create collection: users');
    db.addCollection('users');
  }

  logger.info('Database has been initialized');
}

db.loadDatabase({}, function(err) {
  if (err) {
    logger.error('error loading database');
    logger.error(err);
    process.exit(1);
  }

  databaseInitialize();
});

module.exports = db;
