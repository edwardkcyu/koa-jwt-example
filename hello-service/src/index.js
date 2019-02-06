require('dotenv').config();

const logger = require('./lib/logger');

const { port } = require('./config');
const app = require('./app');

async function main() {
  process.once('SIGINT', () => app.shutDown());
  process.once('SIGTERM', () => app.shutDown());

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
}

main();

module.exports = app;
