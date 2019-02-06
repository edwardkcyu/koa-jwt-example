require('dotenv').config();

const { port } = require('./config');

const logger = require('./lib/logger');
const connectDatabase = require('./lib/database');

const app = require('./app');

process.once('SIGINT', () => app.shutDown());
process.once('SIGTERM', () => app.shutDown());

async function main() {
  const mongod = await connectDatabase();

  app.server.listen(port);

  const onError = function(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  const onListening = function() {
    const addr = app.server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    logger.info('Listening on ' + bind);
  };

  app.server.on('error', onError);
  app.server.on('listening', onListening);

  // don't use arrow function here, as "this" object will be null when using arrow function
  app.shutDown = function() {
    logger.info('Shutdown');

    mongod.stop();

    if (this.server.listening) {
      this.server.shutdown(error => {
        if (error) {
          logger.error(error);
          process.exit(1);
        } else {
          process.exit(0);
        }
      });
    }
  };
}

main();
