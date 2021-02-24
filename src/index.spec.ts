import { printMsg } from './index';

describe('index', () => {
  it('should return "hello world"', () => {
    expect(printMsg()).toBe('hello world!');
  });
});
