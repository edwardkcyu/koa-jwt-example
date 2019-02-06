const { NODE_ENV, PORT, AUTH_SERVICE_URL } = process.env;

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test'; // test is auto set by Jest for unit test
const isDev = NODE_ENV === 'development';

const config = {
  port: PORT,

  nodeEnv: NODE_ENV,
  env: {
    isDev,
    isProd,
    isTest
  },

  cors: {
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  },

  authServiceUrl: AUTH_SERVICE_URL
};

// make sure all the environment variables are set before starting the service
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    console.error(`Invalid config: ${key} = ${value}`);
    process.exit(1);
  }
});

module.exports = config;
