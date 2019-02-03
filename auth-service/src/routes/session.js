const Router = require('koa-router');
const { session: controller } = require('../controllers');

const router = new Router();
router
  .post('/login', controller.create)
  .post('/sessions', controller.create)
  .get('/sessions', controller.verify);

module.exports = router.routes();
