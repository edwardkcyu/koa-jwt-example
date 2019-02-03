const jwt = require('jsonwebtoken');
const { Bearer } = require('permit');

const { jwtSecret } = require('../../config');
const HttpError = require('../../lib/HttpError');
const { HTTP_STATUS } = require('../../lib/constants');

const permit = new Bearer({});

async function verify(ctx) {
  const { req } = ctx;

  const token = permit.check(req);

  if (!token) {
    throw new HttpError({
      status: HTTP_STATUS.UNAUTHORIZED,
      code: 'E001',
      message: 'Authentication required!',
      shouldLog: false
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (e) {
    throw new HttpError({
      status: HTTP_STATUS.UNAUTHORIZED,
      code: 'E002',
      message: 'Invalid authentication',
      shouldLog: false
    });
  }

  const { userName, createdAt } = payload;
  ctx.status = HTTP_STATUS.OK;
  ctx.body = {
    userName,
    createdAt
  };
}

module.exports = verify;
