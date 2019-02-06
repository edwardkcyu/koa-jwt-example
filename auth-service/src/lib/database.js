const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MongoMemoryServer } = require('mongodb-memory-server');

const logger = require('./logger');

async function connectDatabase() {
  const mongod = new MongoMemoryServer({
    instance: {
      dbName: 'koajwt'
    }
  });

  const uri = await mongod.getConnectionString();

  try {
    await mongoose.connect(uri, { useNewUrlParser: true });

    logger.info('Database connected');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  return mongod;
}

module.exports = connectDatabase;
