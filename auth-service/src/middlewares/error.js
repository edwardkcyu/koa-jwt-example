const logger = require('../lib/logger');
const HttpError = require('../lib/HttpError');
const { HTTP_STATUS } = require('../lib/constants');

module.exports = async (ctx, next) => {
  return next().catch(e => {
    if (e instanceof HttpError) {
      const { status, code, message, shouldLog } = e;

      if (shouldLog) {
        logger.error(e);
      }

      ctx.status = status;
      ctx.body = { error: { code, message } };
    } else {
      logger.error(e);
      ctx.status = HTTP_STATUS.SERVER_ERROR;
      ctx.body = {
        error: { message: 'Server error' }
      };
    }
  });
};
