const Router = require('koa-router');
const { greeting: controller } = require('../controllers');

const router = new Router();
router.get('/hello', controller.sayHello).get('/greetings/hello', controller.sayHello);

module.exports = router.routes();
