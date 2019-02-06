const { hash } = require('../../src/lib/utils');

describe('utils.hash', () => {
  test('correctly create SHA256 hash', () => {
    expect(hash('abcd1234password')).toMatchSnapshot();
  });

  test('throw error for null input', () => {
    expect(() => {
      hash(null);
    }).toThrowErrorMatchingSnapshot();
  });

  test('throw error for undefined input', () => {
    expect(() => {
      hash(undefined);
    }).toThrowErrorMatchingSnapshot();
  });
});
