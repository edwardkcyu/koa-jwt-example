const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { jwtSecret } = require('../../config');
const { hash } = require('../../lib/utils');
const { getUserModel } = require('../../models');
const HttpError = require('../../lib/HttpError');
const { HTTP_STATUS } = require('../../lib/constants');

async function login(ctx) {
  const { userName, password } = ctx.request.body;

  if (_.isNil(userName)) {
    throw new HttpError({
      code: 'E001',
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'User name should not be empty'
    });
  }

  if (_.isNil(password)) {
    throw new HttpError({
      code: 'E002',
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'Password name should not be empty'
    });
  }

  const User = getUserModel();

  const user = User.findOne({ name: userName });

  if (!user) {
    throw new HttpError({
      code: 'E003',
      status: HTTP_STATUS.UNAUTHORIZED,
      message: `User(${userName}) not found`
    });
  }

  const { hashedPassword } = user;

  if (hash(password) !== hashedPassword) {
    throw new HttpError({
      code: 'E004',
      status: HTTP_STATUS.UNAUTHORIZED,
      message: 'Invalid password'
    });
  }

  const payload = {
    userName,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: '2m'
  });

  ctx.status = HTTP_STATUS.CREATED;
  ctx.body = {
    token
  };
}

module.exports = login;
