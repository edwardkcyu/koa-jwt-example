require('dotenv').config({ path: 'test/.env.test' });

const request = require('supertest');

const { User } = require('../../../src/models');
const app = require('../../../src/app');
const { HTTP_STATUS } = require('../../../src/lib/constants');

describe('POST /users', () => {
  const url = '/users';

  beforeEach(() => {
    User.findOne = jest.fn(() => null);

    User.prototype.save = jest.fn(() => ({
      _id: '1a2b3c',
      userName: 'curry',
      hashedPassword: 'cba0021ca36477ed4be95626316ac66e31ef7d73e8f9e3888e36737e1a9ae597'
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    app.server.shutdown(function() {
      console.log('Everything is cleanly shutdown.');
    });
  });

  test('successfully registers a user', async () => {
    const response = await request(app.callback())
      .post(url)
      .send({ userName: 'curry', password: '123' })
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.CREATED);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot({
      createdAt: expect.any(String)
    });
  });

  test('responses error if user name is empty', async () => {
    const response = await request(app.callback())
      .post(url)
      .send({ password: '123' })
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.BAD_REQUEST);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('responses error if password is empty', async () => {
    const response = await request(app.callback())
      .post(url)
      .send({ userName: 'curry' })
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.BAD_REQUEST);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('responses error if user already exists', async () => {
    User.findOne = jest.fn(() => ({
      _id: '1a2b3c',
      userName: 'curry',
      hashedPassword: 'cba0021ca36477ed4be95626316ac66e31ef7d73e8f9e3888e36737e1a9ae597'
    }));

    const response = await request(app.callback())
      .post(url)
      .send({ userName: 'curry', password: '123' })
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.BAD_REQUEST);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });
});
