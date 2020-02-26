/**
 * lru.test.js
 *
 * @module lru.test.js
 */

const { LRU } = require('./lru');

const retrieveFunction = () => Promise.resolve(
  Math.ceil(
    Math.random() * 9999,
  ),
);

describe('LRU', () => {
  let instance;
  beforeEach(() => {
    instance = new LRU({
      retrieveFunction,
    });
  });
  describe('get', () => {
    it('should be implemented', async () => {
      const a = { id: 1 };
      const b = { id: 1 };
      const resultA = await instance.get(a);
      const resultB = await instance.get(b);

      expect(resultA).toBe(resultB);
    });
  });
  describe('dump', () => {
    it('should return an empty array when cache is empty', () => {
      const result = instance.dump();
      expect(result).toHaveLength(0);
    });
    it('should return an array with itens on cache', async () => {
      const a = await instance.get('1');
      const b = await instance.get('2');
      const list = instance.dump();

      expect(list).toHaveLength(2);
      expect(list[0].value).toBe(a);
      expect(list[1].value).toBe(b);
    });
  });
});
