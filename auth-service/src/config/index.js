const { NODE_ENV, PORT, JWT_SECRET } = process.env;

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test'; // test is auto set by Jest for unit test
const isDev = NODE_ENV === 'development';

const config = {
  port: PORT,

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

  jwtSecret: JWT_SECRET
};

// make sure all the environment variables are set before starting the service
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    console.error(`Invalid config: ${key} = ${value}`);
    process.exit(1);
  }
});

module.exports = config;
