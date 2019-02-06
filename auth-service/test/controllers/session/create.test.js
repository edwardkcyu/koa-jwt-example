require('dotenv').config({ path: 'test/.env.test' });

const request = require('supertest');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { User } = require('../../../src/models');
const app = require('../../../src/app');
const { HTTP_STATUS } = require('../../../src/lib/constants');

describe('POST /sessions', () => {
  const url = '/sessions';
  const data = {
    userName: 'curry',
    password: 'abcd1234password'
  };

  beforeEach(() => {
    User.findOne = jest.fn(() => ({
      _id: '1a2b3c',
      userName: 'curry',
      hashedPassword: 'cba0021ca36477ed4be95626316ac66e31ef7d73e8f9e3888e36737e1a9ae597'
    }));

    jwt.sign = jest.fn(
      () =>
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImN1cnJ5IiwiY3JlYXRlZEF0IjoiMjAxOS0wMi0wNiAyMTo0MDozOSIsImlhdCI6MTU0OTQ2MDQzOSwiZXhwIjoxNTQ5NDYwNTU5fQ.ufxV-E4datBuELTzD1CmVlbd3Tbu_n3caWobwewR-kk'
    );
  });

  afterEach(() => {});

  afterAll(() => {
    app.server.shutdown(function() {
      console.log('Everything is cleanly shutdown.');
    });
  });

  test('successfully login', async () => {
    const response = await request(app.callback())
      .post(url)
      .send(data)
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.CREATED);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('responses error if empty user name', async () => {
    const response = await request(app.callback())
      .post(url)
      .send(_.omit(data, ['userName']))
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.BAD_REQUEST);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('responses error if empty password', async () => {
    const response = await request(app.callback())
      .post(url)
      .send(_.omit(data, ['password']))
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.BAD_REQUEST);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('responses error if user not found', async () => {
    User.findOne = jest.fn(() => null);

    const response = await request(app.callback())
      .post(url)
      .send(data)
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });
});
