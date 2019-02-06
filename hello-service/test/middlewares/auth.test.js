require('dotenv').config({ path: 'test/.env.test' });

const { auth } = require('../../src/middlewares');
const HttpError = require('../../src/lib/HttpError');

jest.mock('axios');
const axios = require('axios');

describe('Auth middleware', () => {
  let ctx;

  beforeEach(() => {
    axios.mockResolvedValue({ data: { userName: 'curry' } });
    ctx = { header: { authorization: 'DUMMY' } };
  });

  afterEach(() => {
    axios.mockRestore();
  });

  test('works', async () => {
    await auth(ctx, () => {});

    expect(ctx.auth).toMatchSnapshot();
  });

  test('throws error for missing authorization header', async () => {
    delete ctx.header.authorization;

    try {
      await auth(ctx, () => {});
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
    }
  });

  test('throws error when auth service has error', async () => {
    axios.mockImplementation(() => {
      throw new Error('request error');
    });

    try {
      await auth(ctx, () => {});
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
    }
  });
});
