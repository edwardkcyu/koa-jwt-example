const { HTTP_STATUS } = require('../../lib/constants');

async function sayHello(ctx) {
  const { userName } = ctx.auth;

  ctx.status = HTTP_STATUS.OK;
  ctx.body = {
    message: `Hello ${userName}`
  };
}

module.exports = sayHello;
