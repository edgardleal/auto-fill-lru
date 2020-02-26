/**
 * index.test.js
 *
 * @module index.test.js
 */
const { createCache } = require('./index');

let retrieveFunction = () => Promise.resolve(999);
const sleep = (time = 10) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

describe('lru', () => {
  describe('createCache', () => {
    it('createCache should return an object', () => {
      expect(createCache({
        retrieveFunction,
      })).toBeTruthy();
    });
    it('will throw when no retrieveFunction is provided', () => {
      expect(() => createCache()).toThrow();
    });
  });
  describe('operations', () => {
    beforeEach(() => {
      retrieveFunction = jest.fn(() => Promise.resolve(20));
    });
    it('get', async () => {
      const instance = createCache({
        retrieveFunction,
      });
      expect(instance.get()).rejects.toBeInstanceOf(Error);
    });
    it('will call retrieveFunction only one time', async () => {
      const instance = createCache({
        retrieveFunction,
      });
      const spy = jest.spyOn(instance, 'retrieveOriginal');
      await instance.get('1');
      await instance.get('1');
      await instance.get('1');
      expect(spy).toBeCalled();
      expect(retrieveFunction).toBeCalledTimes(1);
    });
    it('removeLast', async () => {
      const instance = createCache({
        retrieveFunction,
        maxSize: 50,
      });
      const spy = jest.spyOn(instance, 'retrieveOriginal');
      const spySet = jest.spyOn(instance, 'set');
      const spyRemoveLast = jest.spyOn(instance, 'removeLast');
      // const spyMap = jest.spyOn(instance.map, 'get');
      await instance.get('1');
      await instance.get('2');
      await instance.get('3');
      await instance.get('4');
      expect(spyRemoveLast).not.toBeCalled();
      expect(spy).toBeCalledTimes(4);
      expect(spySet).toBeCalledTimes(4);
      expect(instance.getSize()).toBe(4);

      instance.removeLast();
      expect(instance.getSize()).toBe(3);

      instance.removeLast();
      expect(instance.getSize()).toBe(2);
    });
  });
  describe('expiration', () => {
    it('should call retrieveFunction again after expiration', async () => {
      retrieveFunction.mockClear();
      const instance = createCache({
        retrieveFunction,
        timeToLive: 1,
      });
      const spy = jest.spyOn(instance, 'retrieveOriginal');
      await instance.get('1');
      await sleep(4);
      await instance.get('1');
      expect(spy).toBeCalledTimes(2);
      expect(retrieveFunction).toBeCalledTimes(2);
    });
    it('should call retrieveFunction size excessed', async () => {
      retrieveFunction.mockClear();
      const instance = createCache({
        retrieveFunction,
        timeToLive: 1000,
        maxSize: 1,
      });
      const spy = jest.spyOn(instance, 'retrieveOriginal');
      const spyRemoveLast = jest.spyOn(instance, 'removeLast');
      const spySet = jest.spyOn(instance, 'set');

      await instance.get('1');
      await instance.get('1'); // one time
      expect(instance.size).toBe(1);
      expect(spy).toBeCalledTimes(1);

      await instance.get('2'); // two time
      expect(spySet).toBeCalledTimes(2);
      expect(spy).toBeCalledTimes(2);
      expect(spyRemoveLast).toBeCalledTimes(1);
      expect(instance.size).toBe(1);
      expect(instance.map.size).toBe(1);

      expect(spy).toBeCalledTimes(2);
      await instance.get('1'); // tree time
      expect(spy).toBeCalledTimes(3);
      expect(spyRemoveLast).toBeCalledTimes(2);
      expect(retrieveFunction).toBeCalledTimes(3);
    });
  });
});
