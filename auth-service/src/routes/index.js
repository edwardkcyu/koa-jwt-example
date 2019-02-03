const Router = require('koa-router');
const router = new Router();

const session = require('./session');
const user = require('./user');

router.use(session).use(user);

module.exports = router;
