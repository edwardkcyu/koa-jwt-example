const _ = require('lodash');
const axios = require('axios');

const { authServiceUrl } = require('../../config');
const HttpError = require('../../lib/HttpError');
const logger = require('../../lib/logger');
const { HTTP_STATUS } = require('../../lib/constants');

async function sayHello(ctx) {
  const { authorization: authorizationHeader } = ctx.header;

  if (_.isNil(authorizationHeader)) {
    throw new HttpError({
      status: HTTP_STATUS.UNAUTHORIZED,
      code: 'E001',
      message: 'Authentication required!',
      shouldLog: false
    });
  }

  let payload;
  try {
    payload = await axios({
      method: 'get',
      url: `${authServiceUrl}/sessions`,
      headers: {
        Authorization: authorizationHeader
      }
    }).then(res => res.data);
  } catch (e) {
    logger.info(`${authorizationHeader}`);
    logger.info(`${e.message}`);
    const response = e.response || {
      status: HTTP_STATUS.UNAUTHORIZED
    };

    throw new HttpError({
      status: response.status,
      code: 'E002',
      message: 'Authentication failed',
      shouldLog: false
    });
  }

  const { userName } = payload;

  ctx.status = HTTP_STATUS.OK;
  ctx.body = {
    message: `Hello ${userName}`
  };
}

module.exports = sayHello;
