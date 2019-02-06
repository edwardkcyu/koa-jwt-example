const _ = require('lodash');
const moment = require('moment');

const { hash } = require('../../lib/utils');
const { User } = require('../../models');
const HttpError = require('../../lib/HttpError');
const { HTTP_STATUS } = require('../../lib/constants');

async function register(ctx) {
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
      message: 'Password should not be empty'
    });
  }

  const existingUser = await User.findOne({ name: userName });

  if (existingUser) {
    throw new HttpError({
      code: 'E003',
      status: HTTP_STATUS.BAD_REQUEST,
      message: `User(${userName}) already exists`
    });
  }

  const now = new Date();
  const user = new User({ name: userName, hashedPassword: hash(password), createdAt: now });
  const insertedUser = await user.save();

  ctx.status = HTTP_STATUS.CREATED;
  ctx.body = {
    userId: insertedUser._id,
    userName,
    createdAt: moment(now).format('YYYY-MM-DD HH:mm:ss')
  };
}

module.exports = register;
