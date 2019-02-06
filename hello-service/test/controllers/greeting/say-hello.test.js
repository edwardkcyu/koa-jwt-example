require('dotenv').config({ path: 'test/.env.test' });

const request = require('supertest');

jest.mock('axios');
const axios = require('axios');

const app = require('../../../src/app');
const { HTTP_STATUS } = require('../../../src/lib/constants');

describe('root route', () => {
  beforeEach(() => {
    axios.mockResolvedValue({ data: { userName: 'curry' } });
  });

  afterAll(() => {
    app.server.shutdown(function() {
      console.log('Everything is cleanly shutdown.');
    });
  });

  test('retrieves user name', async () => {
    const response = await request(app.callback())
      .get('/hello')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer DUMMY_TOKEN');

    expect(response.status).toEqual(HTTP_STATUS.OK);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });

  test('error when missing authorization header', async () => {
    const response = await request(app.callback())
      .get('/hello')
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED);
    expect(response.type).toEqual('application/json');
    expect(response.body).toMatchSnapshot();
  });
});
