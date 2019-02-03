const config = require('./config');
const logger = require('./lib/logger');

require('./lib/database');

const http = require('http');
const Koa = require('koa');

const app = new Koa();

app.keys = [config.secret];

const responseTime = require('koa-response-time');
const helmet = require('koa-helmet');
const koaLogger = require('koa-logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');
const error = require('./middlewares/error');

app.use(responseTime());
app.use(helmet());

if (!config.env.isProd) {
  app.use(koaLogger());
}
app.use(error);

app.use(cors(config.cors));
app.use(bodyParser());

app.use(routes.routes());
app.use(routes.allowedMethods());

app.server = require('http-shutdown')(http.createServer(app.callback()));

// don't use arrow function here, as "this" object will be null when using arrow function
app.shutDown = function() {
  logger.info('Shutdown');

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

module.exports = app;
