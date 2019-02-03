const Router = require('koa-router');
const router = new Router();

const greeting = require('./greeting');

router.use(greeting);

module.exports = router;
