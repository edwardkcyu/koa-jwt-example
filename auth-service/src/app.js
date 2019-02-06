const { env, cors: corsConfig } = require('./config');

const http = require('http');
const Koa = require('koa');

const app = new Koa();

const responseTime = require('koa-response-time');
const helmet = require('koa-helmet');
const koaLogger = require('koa-logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');
const error = require('./middlewares/error');

app.use(responseTime());
app.use(helmet());

if (!env.isProd) {
  app.use(koaLogger());
}
app.use(error);

app.use(cors(corsConfig));
app.use(bodyParser());

app.use(routes.routes());
app.use(routes.allowedMethods());

app.server = require('http-shutdown')(http.createServer(app.callback()));

module.exports = app;
