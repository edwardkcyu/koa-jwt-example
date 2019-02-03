const uuid = require('uuid/v4');
const _ = require('lodash');
const moment = require('moment');

const { hash } = require('../../lib/utils');
const { getUserModel } = require('../../models');
const HttpError = require('../../lib/HttpError');
const { HTTP_STATUS } = require('../../lib/constants');

async function register(ctx) {
  const { userName, password } = ctx.request.body;

  const User = getUserModel();

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

  let user = User.findOne({ name: userName });

  if (user) {
    throw new HttpError({
      code: 'E003',
      status: HTTP_STATUS.BAD_REQUEST,
      message: `User(${userName}) already exists`
    });
  }

  const userId = uuid();
  const now = moment();
  user = User.insert({ id: userId, name: userName, hashedPassword: hash(password), createdAt: now });

  ctx.status = HTTP_STATUS.CREATED;
  ctx.body = {
    userId,
    userName,
    createdAt: now.format('YYYY-MM-DD HH:mm:ss')
  };
}

module.exports = register;
