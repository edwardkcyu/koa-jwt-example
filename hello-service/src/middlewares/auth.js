const _ = require('lodash');
const axios = require('axios');

const { authServiceUrl } = require('../config');
const HttpError = require('../lib/HttpError');
const logger = require('../lib/logger');
const { HTTP_STATUS } = require('../lib/constants');

const checkAuthentication = async (ctx, next) => {
  const { authorization: authorizationHeader } = ctx.header;

  if (_.isNil(authorizationHeader)) {
    throw new HttpError({
      status: HTTP_STATUS.UNAUTHORIZED,
      code: 'E001',
      message: 'Authentication required!',
      shouldLog: false
    });
  }

  try {
    const { data: payload } = await axios({
      method: 'get',
      url: `${authServiceUrl}/sessions`,
      headers: {
        Authorization: authorizationHeader
      }
    });

    ctx.auth = payload;

    await next();
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
};

module.exports = checkAuthentication;
