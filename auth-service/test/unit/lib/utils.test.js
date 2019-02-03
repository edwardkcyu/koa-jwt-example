const { hash } = require('../../../src/lib/utils');

describe('utils.hash', () => {
  test('should correctly create SHA256 hash', () => {
    expect(hash('abcd1234password')).toMatchSnapshot();
  });
});
