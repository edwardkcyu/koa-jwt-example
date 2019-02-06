require('dotenv').config({ path: 'test/.env.test' });

const request = require('supertest');
const _ = require('lodash');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const { User } = require('../../../src/models');
const app = require('../../../src/app');
const { HTTP_STATUS } = require('../../../src/lib/constants');

describe('GET /sessions', () => {
  const url = '/sessions';

  const authorizationHeader =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImN1cnJ5IiwiY3JlYXRlZEF0IjoiMjAxOS0wMi0wNiAyMTo0MDozOSIsImlhdCI6MTU0OTQ2MDQzOSwiZXhwIjoxNTQ5NDYwNTU5fQ.ufxV-E4datBuELTzD1CmVlbd3Tbu_n3caWobwewR-kk';

  beforeEach(() => {
    User.findOne = jest.fn(() => ({
      _id: '1a2b3c',
      userName: 'curry',
      hashedPassword: 'cba0021ca36477ed4be95626316ac66e31ef7d73e8f9e3888e36737e1a9ae597'
    }));

    jwt.verify = jest.fn(() => ({
      userId: '1a2b3c',
      userName: 'curry',
      createdAt: moment('2019-01-01').format('YYYY-MM-DD HH:mm:ss')
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

  test('successfully verify JWT token', async () => {
    const response = await request(app.callback())
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationHeader);

    expect(response.status).toEqual(HTTP_STATUS.OK);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot({
      createdAt: expect.any(String)
    });
  });

  test('responses error if missing authorization header', async () => {
    const response = await request(app.callback())
      .get(url)
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('responses error if invalid token', async () => {
    jwt.verify = jest.fn(() => {
      throw new Error('invalid token');
    });

    const response = await request(app.callback())
      .get(url)
      .set('Content-Type', 'application/json')
      .set('Authorization', authorizationHeader);

    expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });
});
