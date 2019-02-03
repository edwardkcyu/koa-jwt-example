const Router = require('koa-router');
const { user: controller } = require('../controllers');

const router = new Router();
router.post('/register', controller.create).post('/users', controller.create);

module.exports = router.routes();
